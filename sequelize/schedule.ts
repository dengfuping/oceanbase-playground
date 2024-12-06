import { CronJob } from 'cron';
import { range } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import model from '../src/api/model';
import { generateCarOrder } from '../src/pages/OceanBaseWithFlink/util';

const getTime = () => {
  return new Date().toLocaleString('zh-CN');
};

const job = new CronJob(
  // cronTime
  // insert 1000 items at 00:00:01 every day
  '1 0 0 * * *',
  // onTick
  async () => {
    console.log(`${getTime()} [info] Schedule task started.`);
    try {
      const requestId = uuidv4();
      const carColor = generateCarOrder('zh-CN').carColor;
      const mockOrders = range(0, 1000).map(() => {
        return {
          ...generateCarOrder('zh-CN'),
          customerName: 'OceanBase',
          carColor,
          requestId,
        };
      });
      const carOrders = await model.OLTPCarOrder.bulkCreate(mockOrders, {});
      console.log(
        `${getTime()} [info] ${carOrders.length} records insert success.`,
      );
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
