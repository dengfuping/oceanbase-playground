import type { UmiApiRequest, UmiApiResponse } from 'umi';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let latency;
    if (req.method === 'GET') {
      const total = await model.OLAPCarOrder.count({
        logging: (sql, timing) => {
          latency = timing;
        },
      });
      res.status(200).header('X-Sql-Latency', `${latency}`).json({
        total,
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
