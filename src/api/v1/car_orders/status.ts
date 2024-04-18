import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { toNumber } from 'lodash';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    const { orderId } = req.query || {};
    if (req.method === 'GET') {
      const lastestTPCarOrder = await model.OLTPCarOrder.findOne({
        order: [['orderId', 'DESC']],
      });
      const lastestAPCarOrder = await model.OLAPCarOrder.findOne({
        order: [['orderId', 'DESC']],
      });
      res.status(200).json({
        syncing: lastestAPCarOrder?.orderId !== lastestTPCarOrder?.orderId,
        shouldRefresh: toNumber(orderId) !== lastestAPCarOrder?.orderId,
      });
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
