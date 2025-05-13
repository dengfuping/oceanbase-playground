import { request } from 'umi';
import type { RequestOptions } from 'umi';
import type { Prisma, CarOrder } from '@prisma/client';

export interface QueryParams {
  readonlyColumnStoreReplica?: boolean;
  rowStore?: boolean;
  htap?: boolean;
  type?: 'tp' | 'ap';
}

export async function createCarOrder(
  params: QueryParams,
  body: Omit<Prisma.CarOrderCreateInput, 'orderTime'>,
  options?: RequestOptions,
) {
  return request<{
    data?: CarOrder;
    sqlText?: string;
    latency?: number;
  }>(`/api/v1/car_orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params,
    data: body,
    ...(options || {}),
  });
}

export async function batchCreateCarOrder(
  params: QueryParams,
  body: Omit<Prisma.CarOrderCreateInput, 'orderTime'>[],
  options?: RequestOptions,
) {
  return request<{
    data?: CarOrder[];
    sqlText?: string;
    latency?: number;
  }>(`/api/v1/car_orders/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params,
    data: body,
    ...(options || {}),
  });
}

export async function getTotal(params: QueryParams, options?: RequestOptions) {
  return request<{
    total?: number;
    sqlText?: string;
    latency?: number;
  }>(`/api/v1/car_orders/total`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getColorTop3(params: QueryParams, options?: RequestOptions) {
  return request<{
    data?: { carColor: string; count: number }[];
    sqlText?: string;
    latency?: number;
  }>(`/api/v1/car_orders/color_top3`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getLatest(params: QueryParams, options?: RequestOptions) {
  return request<{
    data?: CarOrder[];
    sqlText?: string;
    latency?: number;
  }>(`/api/v1/car_orders/latest`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function getStatus(
  params: QueryParams & {
    orderId?: bigint;
  },
  options?: RequestOptions,
) {
  return request<{ syncing?: boolean; shouldRefresh?: boolean }>(`/api/v1/car_orders/status`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
