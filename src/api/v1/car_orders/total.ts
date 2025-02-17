import type { UmiApiRequest, UmiApiResponse } from 'umi';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let total;
    let sqlText;
    let latency;
    if (req.method === 'GET') {
      const readonlyColumnStoreReplica = req.query.readonlyColumnStoreReplica === 'true';
      if (readonlyColumnStoreReplica) {
        total = await model.OLAPReadonlyCarOrder.count({
          logging: (sql, timing) => {
            sqlText = sql?.replaceAll('Executed (default): ', '');
            latency = timing;
          },
        });
      } else {
        total = await model.OLAPCarOrder.count({
          logging: (sql, timing) => {
            sqlText = sql?.replaceAll('Executed (default): ', '');
            latency = timing;
          },
        });
      }
      res.status(200).json({
        total,
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
