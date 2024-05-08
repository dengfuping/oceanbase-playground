import type { UmiApiRequest, UmiApiResponse } from 'umi';
import model from '../../model';
import moment from 'moment';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    let latency;
    if (req.method === 'POST') {
      const carOrders = await model.OLTPCarOrder.bulkCreate(
        req.body.map((item) => ({
          ...item,
          // 入库时使用 UTC 时间
          orderTime: moment().utc().format(),
        })),
        {
          logging: (sql, timing) => {
            latency = timing;
            // console.log(sql);
            // console.log(`SQL 耗时：`, timing, 'ms');
            // console.log('\n');
          },
        },
      );
      res.status(200).header('X-Sql-Latency', `${latency}`).json(carOrders);
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
