import { request } from 'umi';
import type { RequestOptions } from 'umi';
import type { Prisma, CarOrder } from '@prisma/client';

export async function createCarOrder(
  body: Omit<Prisma.CarOrderCreateInput, 'orderTime'>,
  options?: RequestOptions,
) {
  return request<CarOrder>(`/api/v1/car_orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function batchCreateCarOrder(
  body: Omit<Prisma.CarOrderCreateInput, 'orderTime'>[],
  options?: RequestOptions,
) {
  return request<CarOrder>(`/api/v1/car_orders/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getTotal(options?: RequestOptions) {
  return request<{
    total: number;
    latency: number;
  }>(`/api/v1/car_orders/total`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getColorTop3(options?: RequestOptions) {
  return request<{
    data?: { carColor: string; count: number }[];
    latency?: number;
  }>(`/api/v1/car_orders/color_top3`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getLatest(
  params: {
    orderId?: string | Date;
  },
  options?: RequestOptions,
) {
  return request<{
    data?: CarOrder[];
    latency?: number;
  }>(`/api/v1/car_orders/latest`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getStatus(
  params: {
    orderId?: string | Date;
  },
  options?: RequestOptions,
) {
  return request<{ syncing?: boolean; shouldRefresh?: boolean }>(
    `/api/v1/car_orders/status`,
    {
      method: 'GET',
      params,
      ...(options || {}),
    },
  );
}
