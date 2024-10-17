import type { UmiApiRequest, UmiApiResponse } from 'umi';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let sqlText;
    let latency;
    if (req.method === 'POST') {
      const carOrders = await model.OLTPCarOrder.bulkCreate(req.body, {
        logging: (sql, timing) => {
          sqlText = sql?.replaceAll('Executed (default): ', '');
          latency = timing;
        },
      });
      res.status(200).json({
        data: carOrders,
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
