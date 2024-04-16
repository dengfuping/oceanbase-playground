import type { UmiApiRequest, UmiApiResponse } from 'umi';
import { Sequelize } from 'sequelize';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    if (req.method === 'GET') {
      const result = await model.OLAPCarOrder.findAll({
        group: 'car_color',
        attributes: ['carColor', [Sequelize.fn('COUNT', 'car_color'), 'count']],
        order: [['count', 'DESC']],
        limit: 3,
      });
      res.status(200).json(result);
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
