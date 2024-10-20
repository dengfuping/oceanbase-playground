import { CronJob } from 'cron';
import { range } from 'lodash';
import model from '../src/api/model';
import { generateCarOrder } from '../src/pages/OceanBaseWithFlink/util';

const getTime = () => {
  return new Date().toLocaleString('zh-CN');
};

const job = new CronJob(
  // cronTime
  '0 0 0 * * *',
  // onTick
  async () => {
    console.log(`${getTime()} [info] Schedule task started.`);
    try {
      const mockOrders = range(0, 1000).map(() => {
        return generateCarOrder('zh-CN');
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
