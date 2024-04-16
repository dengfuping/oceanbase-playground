import type { UmiApiRequest, UmiApiResponse } from 'umi';
import dataSource from '../../dataSource';
import OLAPCarOrder from '../../entity/OLAPCarOrder';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    if (req.method === 'GET') {
      const total = await dataSource.olap.manager.count(OLAPCarOrder);
      res.status(200).json(total);
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
