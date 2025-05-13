import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { QueryTypes } from 'sequelize';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let result;
    let sqlText;
    let latency;
    if (req.method === 'GET') {
      const readonlyColumnStoreReplica = req.query.readonlyColumnStoreReplica === 'true';
      const rowStore = req.query.rowStore === 'true';
      const htap = req.query.htap === 'true';
      const type = req.query.type;
      if (readonlyColumnStoreReplica || rowStore) {
        const carOrder = readonlyColumnStoreReplica
          ? model.OLAPReadonlyCarOrder
          : model.OLTPCarOrder;
        result = await carOrder.sequelize?.query(
          'SELECT `car_color` AS `carColor`, COUNT(`car_color`) AS `count` FROM `tp_car_orders` AS `tp_car_orders` WHERE `order_time` >= CURRENT_DATE AND `order_time` < DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY) GROUP BY `car_color` ORDER BY `count` DESC LIMIT 3;',
          {
            // ref: https://sequelize.org/docs/v6/core-concepts/raw-queries/
            type: QueryTypes.SELECT,
            logging: (sql, timing) => {
              sqlText = sql?.replaceAll('Executed (default): ', '');
              latency = timing;
            },
          },
        );
      } else if (htap && type) {
        const carOrder = type === 'tp' ? model.TPCarOrder : model.APCarOrder;
        result = await carOrder.sequelize?.query(
          'SELECT `car_color` AS `carColor`, COUNT(`car_color`) AS `count` FROM `car_orders` AS `car_orders` WHERE `order_time` >= CURRENT_DATE AND `order_time` < DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY) GROUP BY `car_color` ORDER BY `count` DESC LIMIT 3;',
          {
            // ref: https://sequelize.org/docs/v6/core-concepts/raw-queries/
            type: QueryTypes.SELECT,
            logging: (sql, timing) => {
              sqlText = sql?.replaceAll('Executed (default): ', '');
              latency = timing;
            },
          },
        );
      } else {
        result = await model.OLAPCarOrder.sequelize?.query(
          'SELECT `car_color` AS `carColor`, COUNT(`car_color`) AS `count` FROM `ap_car_orders` AS `ap_car_orders` WHERE `order_time` >= CURRENT_DATE AND `order_time` < DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY) GROUP BY `car_color` ORDER BY `count` DESC LIMIT 3;',
          {
            // ref: https://sequelize.org/docs/v6/core-concepts/raw-queries/
            type: QueryTypes.SELECT,
            logging: (sql, timing) => {
              sqlText = sql?.replaceAll('Executed (default): ', '');
              latency = timing;
            },
          },
        );
      }
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
