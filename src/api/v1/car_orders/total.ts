import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { QueryTypes } from 'sequelize';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let sqlText;
    let latency;
    let total;
    if (req.method === 'GET') {
      const materializedView = req.query.materializedView === 'true';
      if (materializedView) {
        const result: { count?: number }[] | undefined = await model.OLAPCarOrder.sequelize?.query(
          'select * from mv_ap_car_orders_total;',
          {
            type: QueryTypes.SELECT,
            logging: (sql, timing) => {
              sqlText = sql?.replaceAll('Executed (default): ', '');
              latency = timing;
            },
          },
        );
        total = result?.[0]?.count || 0;
      } else {
        total = await model.OLAPCarOrder.count({
          logging: (sql, timing) => {
            sqlText = sql?.replaceAll('Executed (default): ', '');
            latency = timing;
          },
        });
      }
      res.status(200).json({
        total,
        sqlText,
        latency,
      });
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
