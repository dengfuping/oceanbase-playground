import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { Sequelize, Op } from 'sequelize';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let sqlText;
    let latency;
    if (req.method === 'GET') {
      const result = await model.OLAPCarOrder.findAll({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('DATE', Sequelize.col('order_time')),
              Sequelize.literal('CURRENT_DATE'),
            ),
          ],
        },
        group: 'car_color',
        attributes: ['carColor', [Sequelize.fn('COUNT', 'car_color'), 'count']],
        order: [['count', 'DESC']],
        limit: 3,
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
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
