import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { Op } from 'sequelize';
import { toNumber } from 'lodash';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
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
            latency = timing;
            console.log(sql);
            console.log(`SQL 耗时：`, timing, 'ms');
            console.log('\n');
          },
        });
        res.status(200).header('X-Sql-Latency', `${latency}`).json({
          data: result,
          latency,
        });
      } else {
        const result = await model.OLAPCarOrder.findAll({
          order: [['orderId', 'DESC']],
          limit: 10,
          logging: (sql, timing) => {
            latency = timing;
            console.log(sql);
            console.log(`SQL 耗时：`, timing, 'ms');
            console.log('\n');
          },
        });
        res.status(200).header('X-Sql-Latency', `${latency}`).json({
          data: result,
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
