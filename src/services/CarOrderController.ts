import request from 'umi-request';
import type { RequestOptionsInit } from 'umi-request';
import type { Prisma, CarOrder } from '@prisma/client';

export async function createCarOrder(
  body: Omit<Prisma.CarOrderCreateInput, 'orderTime'>,
  options?: RequestOptionsInit,
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
  options?: RequestOptionsInit,
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

export async function getTotal(options?: RequestOptionsInit) {
  return request<{
    total: number;
    latency: number;
  }>(`/api/v1/car_orders/total`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getColorTop3(options?: RequestOptionsInit) {
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
  options?: RequestOptionsInit,
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
  options?: RequestOptionsInit,
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
