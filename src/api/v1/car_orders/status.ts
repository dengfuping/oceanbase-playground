import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { toNumber } from 'lodash';
import { QueryTypes } from 'sequelize';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    const { orderId } = req.query || {};
    let lastestAPCarOrder;
    let latencyTP;
    let latencyAP;
    if (req.method === 'GET') {
      const readonlyColumnStoreReplica = req.query.readonlyColumnStoreReplica === 'true';
      const rowStore = req.query.rowStore === 'true';
      const htap = req.query.htap === 'true';
      const type = req.query.type;

      let lastestTPCarOrder;
      if (htap) {
        const result = await model.TPCarOrder.sequelize?.query(
          'SELECT `order_id` AS `orderId` FROM `car_orders` AS `car_orders` WHERE `order_time` >= CURRENT_DATE AND `order_time` < DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY) ORDER BY `orderId` DESC LIMIT 1;',
          {
            // ref: https://sequelize.org/docs/v6/core-concepts/raw-queries/
            type: QueryTypes.SELECT,
            logging: (sql, timing) => {
              latencyTP = timing;
            },
          },
        );
        lastestTPCarOrder = result?.[0];
      } else {
        lastestTPCarOrder = await model.OLTPCarOrder.findOne({
          order: [['orderId', 'DESC']],
          logging: (sql, timing) => {
            latencyTP = timing;
          },
        });
      }

      if (readonlyColumnStoreReplica || rowStore) {
        const carOrder = readonlyColumnStoreReplica
          ? model.OLAPReadonlyCarOrder
          : model.OLTPCarOrder;
        lastestAPCarOrder = await carOrder.findOne({
          order: [['orderId', 'DESC']],
          logging: (sql, timing) => {
            latencyAP = timing;
          },
        });
      } else if (htap && type) {
        const carOrder = type === 'tp' ? model.TPCarOrder : model.APCarOrder;
        const result = await carOrder.sequelize?.query(
          'SELECT `order_id` AS `orderId` FROM `car_orders` AS `car_orders` WHERE `order_time` >= CURRENT_DATE AND `order_time` < DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY) ORDER BY `orderId` DESC LIMIT 1;',
          {
            // ref: https://sequelize.org/docs/v6/core-concepts/raw-queries/
            type: QueryTypes.SELECT,
            logging: (sql, timing) => {
              latencyAP = timing;
            },
          },
        );
        lastestAPCarOrder = result?.[0];
      } else {
        lastestAPCarOrder = await model.OLAPCarOrder.findOne({
          order: [['orderId', 'DESC']],
          logging: (sql, timing) => {
            latencyAP = timing;
          },
        });
      }
      res
        .status(200)
        .header('X-TP-Sql-Latency', `${latencyTP}`)
        .header('X-AP-Sql-Latency', `${latencyAP}`)
        .json({
          syncing: lastestAPCarOrder?.orderId !== lastestTPCarOrder?.orderId,
          shouldRefresh: toNumber(orderId || 0) !== toNumber(lastestAPCarOrder?.orderId || 0),
          latencyTP,
          latencyAP,
        });
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
