import type { UmiApiRequest, UmiApiResponse } from 'umi';
import prisma from '../../client';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    if (req.method === 'GET') {
      const total = await prisma.oltp.carOrder.count();
      res.status(200).json(total);
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
