import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { QueryTypes } from 'sequelize';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let sqlText;
    let latency;
    if (req.method === 'GET') {
      const result = await model.OLAPCarOrder.sequelize?.query(
        'SELECT `car_color` AS `carColor`, COUNT(`car_color`) AS `count` FROM `ap_car_orders` AS `ap_car_orders` WHERE `order_time` >= CURRENT_DATE AND `order_time` < CURRENT_DATE + 1 GROUP BY `car_color` ORDER BY `count` DESC LIMIT 3;',
        {
          // ref: https://sequelize.org/docs/v6/core-concepts/raw-queries/
          type: QueryTypes.SELECT,
          logging: (sql, timing) => {
            sqlText = sql?.replaceAll('Executed (default): ', '');
            latency = timing;
          },
        },
      );
      res.status(200).json({
        data: result,
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
