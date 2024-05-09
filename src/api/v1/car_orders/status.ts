import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { toNumber } from 'lodash';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    const { orderId } = req.query || {};
    let latencyTP;
    let latencyAP;
    if (req.method === 'GET') {
      const lastestTPCarOrder = await model.OLTPCarOrder.findOne({
        order: [['orderId', 'DESC']],
        logging: (sql, timing) => {
          latencyTP = timing;
        },
      });
      const lastestAPCarOrder = await model.OLAPCarOrder.findOne({
        order: [['orderId', 'DESC']],
        logging: (sql, timing) => {
          latencyAP = timing;
        },
      });
      res
        .status(200)
        .header('X-TP-Sql-Latency', `${latencyTP}`)
        .header('X-AP-Sql-Latency', `${latencyAP}`)
        .json({
          syncing: lastestAPCarOrder?.orderId !== lastestTPCarOrder?.orderId,
          shouldRefresh: orderId
            ? toNumber(orderId) !== lastestAPCarOrder?.orderId
            : false,
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
