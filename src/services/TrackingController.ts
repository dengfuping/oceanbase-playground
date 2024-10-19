import { request } from 'umi';

export interface EventTrackingPayload {
  requestId?: string;
  serviceSourceFromType?: string;
  resourcesId?: string;
  resourceCode?: string;
  type: number;
  eventType: number;
  userId?: string;
  resourcesName?: string;
  cookieId?: string;
  firstSource?: string;
  lastSource?: string;
  pageSource?: string;
  previousPage?: string;
}

export async function eventTracking(payload: EventTrackingPayload) {
  return request(
    'https://cn-wan-api.oceanbase.com/wanApi/forum/tracking/v1/eventTracking',
    {
      method: 'POST',
      contentType: 'applicationJson',
      data: payload,
      withCredentials: true,
    },
  );
}
