import type { UmiApiRequest, UmiApiResponse } from 'umi';
import prisma from '../../client';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    if (req.method === 'GET') {
      const { queryTime } = req.params || {};
      if (queryTime) {
        const result = await prisma.oltp.carOrder.findMany({
          where: {
            orderTime: {
              gte: req.params.queryTime,
            },
          },
          orderBy: {
            orderTime: 'desc',
          },
        });
        res.status(200).json(result);
      } else {
        const result = await prisma.oltp.carOrder.findMany({
          orderBy: {
            orderTime: 'desc',
          },
          take: 10,
        });
        res.status(200).json(result);
      }
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
