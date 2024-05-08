import type { UmiApiRequest, UmiApiResponse } from 'umi';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let latency;
    if (req.method === 'GET') {
      const carOrders = await model.OLAPCarOrder.findAll({
        logging: (sql, timing) => {
          latency = timing;
          // console.log(sql);
          // console.log(`SQL 耗时：`, timing, 'ms');
          // console.log('\n');
        },
      });
      res.status(200).header('X-Sql-Latency', `${latency}`).json(carOrders);
    } else if (req.method === 'POST') {
      const carOrder = await model.OLTPCarOrder.create(req.body);
      res.status(200).header('X-Sql-Latency', `${latency}`).json(carOrder);
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
