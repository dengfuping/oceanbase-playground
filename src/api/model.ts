import { Sequelize, DataTypes } from 'sequelize';
import mysql2 from 'mysql2';

const oltp = new Sequelize(process.env.OLTP_DATABASE_URL as string, {
  benchmark: true,
  logging: false,
  dialectModule: mysql2,
  timezone: '+08:00',
});
const olap = new Sequelize(process.env.OLAP_DATABASE_URL as string, {
  benchmark: true,
  logging: false,
  dialectModule: mysql2,
  timezone: '+08:00',
});
const olapReadonly = new Sequelize(process.env.OLAP_READONLY_DATABASE_URL as string, {
  benchmark: true,
  logging: false,
  dialectModule: mysql2,
  timezone: '+08:00',
});
const tp = new Sequelize(process.env.HTAP_TP_DATABASE_URL as string, {
  benchmark: true,
  logging: false,
  dialectModule: mysql2,
  timezone: '+08:00',
});

const ap = new Sequelize(process.env.HTAP_AP_DATABASE_URL as string, {
  benchmark: true,
  logging: false,
  dialectModule: mysql2,
  timezone: '+08:00',
});

const option = {
  orderId: {
    field: 'order_id',
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  orderTime: {
    field: 'order_time',
    type: DataTypes.TIME,
    allowNull: false,
  },
  carPrice: {
    field: 'car_price',
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  carColor: {
    field: 'car_color',
    type: DataTypes.STRING,
    allowNull: false,
  },
  saleRegion: {
    field: 'sale_region',
    type: DataTypes.STRING,
    allowNull: false,
  },
  saleNation: {
    field: 'sale_nation',
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerName: {
    field: 'customer_name',
    type: DataTypes.STRING,
    allowNull: false,
  },
  requestId: {
    field: 'request_id',
    type: DataTypes.STRING,
    allowNull: true,
  },
};

const OLTPCarOrder = oltp.define('tp_car_orders', option, {
  timestamps: false,
});
const OLAPCarOrder = olap.define('ap_car_orders', option, {
  timestamps: false,
});
const OLAPReadonlyCarOrder = olapReadonly.define('tp_car_orders', option, {
  timestamps: false,
});
const TPCarOrder = tp.define('car_orders', option, {
  timestamps: false,
});
const APCarOrder = ap.define('car_orders', option, {
  timestamps: false,
});

export default { OLTPCarOrder, OLAPCarOrder, OLAPReadonlyCarOrder, TPCarOrder, APCarOrder };
