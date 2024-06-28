import { range } from 'lodash';
import model from '../src/api/model';
import { generateCarOrder } from '../src/pages/OceanBaseWithFlink/util';

const totalInsertSize = 150000000;
const batchInsertSize = 10000;
const batchInsertCount = totalInsertSize / batchInsertSize;

async function batchInsert(i: number) {
  let currentTiming: number | undefined;
  try {
    await model.OLTPCarOrder.bulkCreate(
      range(0, batchInsertSize).map(() => {
        return generateCarOrder('en-US');
      }),
      {
        logging: (sql, timing) => {
          currentTiming = timing;
        },
      },
    );
    const total = await model.OLTPCarOrder.count();
    console.log(`[info] Batch insert count: ${i}`);
    console.log(
      `[info]`,
      batchInsertSize,
      `records are inserted successfully and execution time is`,
      currentTiming,
      'ms',
    );
    console.log(`[info] Current total records:`, total, '\n');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function seed() {
  for (let i = 1; i < batchInsertCount + 1; i++) {
    await batchInsert(i);
  }
}

seed()
  .then(() => {
    console.log(
      `[info] Total ${totalInsertSize} records are inserted successfully`,
    );
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
