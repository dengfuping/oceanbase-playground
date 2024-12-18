import { CronJob } from 'cron';
import { sample, range } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import model from '../src/api/model';
import { generateCarOrder } from '../src/pages/OceanBaseWithFlink/util';
import { COLOR_LIST } from '../src/pages/OceanBaseWithFlink/constant';

const getTime = () => {
  return new Date().toLocaleString('zh-CN');
};

const job = new CronJob(
  // cronTime
  // insert orders at 00:00:01 every day
  '1 0 0 * * *',
  // onTick
  async () => {
    console.log(`${getTime()} [info] Schedule task started.`);
    try {
      // insert orders of 3 kinds of color
      range(0, 3).forEach(async () => {
        const carColor = sample(COLOR_LIST.map((item) => item.value));
        const requestId = uuidv4();
        const mockOrders = range(100, 200).map(() => {
          return {
            ...generateCarOrder('zh-CN'),
            customerName: 'OceanBase',
            carColor,
            requestId,
          };
        });
        const carOrders = await model.OLTPCarOrder.bulkCreate(mockOrders, {});
        console.log(`${getTime()} [info] ${carOrders.length} ${carColor} records insert success.`);
      });
      console.log(`${getTime()} [info] Schedule task started.`);
      console.log(`${getTime()} [info] Schedule task success.`);
    } catch {
      console.log(`${getTime()} [error] Schedule task failed.`);
    }
  },
  // onComplete
  null,
  // start
  true,
  'Asia/Shanghai', // timeZone
);

job.start();
