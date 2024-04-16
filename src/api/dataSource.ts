import { DataSource } from 'typeorm';
import 'reflect-metadata';
import OLTPCarOrder from './entity/OLTPCarOrder';
import OLAPCarOrder from './entity/OLAPCarOrder';

const oltp = new DataSource({
  type: 'mysql',
  url: process.env.OLTP_DATABASE_URL,
  entities: [OLTPCarOrder],
  synchronize: true,
});

const olap = new DataSource({
  type: 'mysql',
  url: process.env.OLAP_DATABASE_URL,
  entities: [OLAPCarOrder],
  synchronize: true,
});

oltp
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

olap
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

const dataSource = { oltp, olap };

export default dataSource;
