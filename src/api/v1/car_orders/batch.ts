import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { uniq } from 'lodash';
import model from '../../model';
import security from '../../security';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    const htap = req.query.htap === 'true';
    let sqlText;
    let latency;
    if (req.method === 'POST') {
      const customerNames: string[] = uniq(req.body?.map((item: any) => item.customerName));
      const promiseList = customerNames.map((item) => security.nicknameDetection(item));
      const responses = await Promise.all(promiseList);
      const existNotSecure = responses.some((response) => {
        const labels = response.Data?.labels || '';
        if (labels) {
          console.log(response);
        }
        return labels ? true : false;
      });
      if (existNotSecure) {
        res.status(500).json({
          errorMessage: 'Username is illegal or sensitive, please input again',
        });
      } else {
        const carOrder = htap ? model.TPCarOrder : model.OLTPCarOrder;
        const transaction = await carOrder.sequelize?.transaction();
        try {
          const carOrders = await carOrder.bulkCreate(req.body, {
            transaction,
            logging: (sql, timing) => {
              sqlText = sql?.replaceAll(/Executed (\S*): /g, htap ? model.htapMap.tp : '');
              latency = timing;
            },
          });
          res.status(200).json({
            data: carOrders,
            sqlText,
            latency,
          });
          await transaction?.commit();
        } catch (err) {
          await transaction?.rollback();
          console.log(err);
          res.status(500).json({
            errorMessage: 'Batch insert transaction has been rollback',
          });
        }
      }
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
