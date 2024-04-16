import type { UmiApiRequest, UmiApiResponse } from 'umi';
import prisma from '../../client';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    if (req.method === 'GET') {
      const result = await prisma.oltp.carOrder.groupBy({
        by: ['carColor'],
        _count: {
          carColor: true,
        },
        orderBy: {
          _count: {
            carColor: 'desc',
          },
        },
        take: 3,
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
