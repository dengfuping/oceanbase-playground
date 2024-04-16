import type { UmiApiRequest, UmiApiResponse } from 'umi';
import dataSource from '../../dataSource';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    if (req.method === 'GET') {
      // const carOrders = await olap.carOrder.findMany({});
      // res.status(200).json(carOrders);
    } else if (req.method === 'POST') {
      // const carOrder = await prisma.oltp.carOrder.create({
      //   data: req.body,
      // });
      // res.status(200).json(carOrder);
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
