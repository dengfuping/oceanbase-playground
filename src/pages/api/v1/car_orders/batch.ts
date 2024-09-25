import type { NextApiRequest, NextApiResponse } from 'next';
import model from '../../model';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    let latency;
    if (req.method === 'POST') {
      const carOrders = await model.OLTPCarOrder.bulkCreate(req.body, {
        logging: (sql, timing) => {
          latency = timing;
          // console.log(sql);
          // console.log(`SQL 耗时：`, timing, 'ms');
          // console.log('\n');
        },
      });
      res.status(200).setHeader('X-Sql-Latency', `${latency}`).json(carOrders);
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
