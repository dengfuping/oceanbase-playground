import type { UmiApiRequest, UmiApiResponse } from 'umi';
import model from '../../model';
import moment from 'moment';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    if (req.method === 'GET') {
      const carOrders = await model.OLAPCarOrder.findAll();
      res.status(200).json(carOrders);
    } else if (req.method === 'POST') {
      const carOrder = await model.OLTPCarOrder.create({
        ...req.body,
        orderTime: moment().format(),
      });
      res.status(200).json(carOrder);
    } else {
      res.status(405).json({ errorMessage: 'Method not allowed' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
}
