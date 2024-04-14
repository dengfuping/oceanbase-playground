import { PrismaClient } from '@prisma/client';
import type { CarOrder } from '@prisma/client';

const oltp = new PrismaClient({
  datasources: {
    db: {
      url: process.env.OLTP_DATABASE_URL,
    },
  },
  // log: ['query'],
}).$extends({
  name: 'car-order-id-stringify',
  result: {
    carOrder: {
      orderId: {
        compute(value: CarOrder) {
          return value.orderId?.toString();
        },
      },
    },
  },
});

const olap = new PrismaClient({
  datasources: {
    db: {
      url: process.env.OLAP_DATABASE_URL,
    },
  },
  // log: ['query'],
}).$extends({
  name: 'car-order-id-stringify',
  result: {
    carOrder: {
      orderId: {
        compute(value: CarOrder) {
          return value.orderId?.toString();
        },
      },
    },
  },
});

const prisma = {
  oltp,
  // 本地调试，暂时先用同一个数据源，等后续提供两个同步数据源再切换
  olap: oltp,
};

export default prisma;
