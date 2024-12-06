import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { QueryTypes } from 'sequelize';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let sqlText;
    let latency;
    if (req.method === 'GET') {
      const result = await model.OLAPCarOrder.sequelize?.query(
        'SELECT max(`order_id`) AS `orderId`, `order_time` AS `orderTime`, `car_color` AS `carColor`, `customer_name` AS `customerName`, `request_id` as requestId, count(*) as count FROM `ap_car_orders` AS `ap_car_orders` GROUP BY `orderTime`, `customerName`, `requestId` ORDER BY `orderTime` DESC LIMIT 10;',
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
