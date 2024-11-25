import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { uniq } from 'lodash';
import model from '../../model';
import security from '../../security';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let sqlText;
    let latency;
    if (req.method === 'POST') {
      const customerNames: string[] = uniq(
        req.body?.map((item: any) => item.customerName),
      );
      const promiseList = customerNames.map((item) =>
        security.nicknameDetection(item),
      );
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
          errorCode: 'BizError',
        });
      } else {
        const carOrders = await model.OLTPCarOrder.bulkCreate(req.body, {
          logging: (sql, timing) => {
            sqlText = sql?.replaceAll('Executed (default): ', '');
            latency = timing;
          },
        });
        res.status(200).json({
          data: carOrders,
          sqlText,
          latency,
        });
      }
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
