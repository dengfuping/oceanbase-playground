import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { Op } from 'sequelize';
import { toNumber } from 'lodash';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let sqlText;
    let latency;
    if (req.method === 'GET') {
      const { orderId } = req.query || {};
      if (orderId) {
        const result = await model.OLAPCarOrder.findAll({
          where: {
            orderId: {
              [Op.gt]: toNumber(orderId),
            },
          },
          order: [['orderId', 'DESC']],
          logging: (sql, timing) => {
            sqlText = sql?.replaceAll('Executed (default): ', '');
            latency = timing;
          },
        });
        res.status(200).json({
          data: result,
          sqlText,
          latency,
        });
      } else {
        const result = await model.OLAPCarOrder.findAll({
          order: [['orderId', 'DESC']],
          limit: 10,
          logging: (sql, timing) => {
            sqlText = sql?.replaceAll('Executed (default): ', '');
            latency = timing;
          },
        });
        res.status(200).json({
          data: result,
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
