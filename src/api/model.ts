import { Sequelize, DataTypes } from 'sequelize';
import mysql2 from 'mysql2';

const oltp = new Sequelize(process.env.OLTP_DATABASE_URL as string, {
  benchmark: true,
  logging: true,
  timezone: '+08:00',
  dialectModule: mysql2,
});
const olap = new Sequelize(process.env.OLAP_DATABASE_URL as string, {
  benchmark: true,
  logging: true,
  timezone: '+08:00',
  dialectModule: mysql2,
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
};

const OLTPCarOrder = oltp.define('tp_car_orders', option, {
  timestamps: false,
});
const OLAPCarOrder = olap.define('ap_car_orders', option, {
  timestamps: false,
});

export default { OLTPCarOrder, OLAPCarOrder };
