import type { UmiApiRequest, UmiApiResponse } from 'umi';
import moment from 'moment';
import model from '../../model';

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  try {
    if (req.method === 'GET') {
      const carOrders = await model.OLAPCarOrder.findAll();
      res.status(200).json(carOrders);
    } else if (req.method === 'POST') {
      const carOrder = await model.OLTPCarOrder.create({
        ...req.body,
        // 由于数据库中并不保存时区信息，需要创建东八区时间之后再写入，保证查询出的时间符合预期
        orderTime: moment().utcOffset(8).format(),
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
