import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { Op } from 'sequelize';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    if (req.method === 'GET') {
      const { queryTime } = req.params || {};
      if (queryTime) {
        const result = await model.OLAPCarOrder.findAll({
          where: {
            orderTime: {
              [Op.gte]: req.params.queryTime,
            },
          },
          order: [['order_time', 'DESC']],
        });
        res.status(200).json(result);
      } else {
        const result = await model.OLAPCarOrder.findAll({
          order: [['order_time', 'DESC']],
          limit: 10,
        });
        res.status(200).json(result);
      }
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}