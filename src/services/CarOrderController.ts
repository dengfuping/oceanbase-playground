import { request } from 'umi';
import type { RequestOptions } from 'umi';
import type { Prisma } from '@prisma/client';

export async function getCarOrderCount(options?: RequestOptions) {
  return request<number>(`/api/v1/car_orders/count`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createCarOrder(options?: RequestOptions) {
  return request<Prisma.CarOrderCreateInput>(`/api/v1/car_orders`, {
    method: 'POST',
    ...(options || {}),
  });
}
