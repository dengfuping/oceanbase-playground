import RPCClient from '@alicloud/pop-core';

interface SecurityResponse {
  RequestId?: string;
  Message?: string;
  Data?: { reason?: string; labels?: string };
  Code?: number;
}

const client: any = new RPCClient({
  accessKeyId: process.env.SECURITY_CHECK_ACCESS_KEY,
  accessKeySecret: process.env.SECURITY_CHECK_ACCESS_SECRET,
  endpoint: 'https://green-cip.cn-shanghai.aliyuncs.com',
  apiVersion: '2022-03-02',
});

async function nicknameDetection(content?: string) {
  if (process.env.SECURITY_CHECK_ENABLA !== 'true') {
    console.log('SECURITY_CHECK_ENABLA is disabled');
    return {};
  }
  const params = {
    Service: 'nickname_detection',
    ServiceParameters: JSON.stringify({
      content,
    }),
  };

  const requestOption = {
    method: 'POST',
    formatParams: false,
  };
  let response: SecurityResponse = {};

  try {
    response = await client.request('TextModeration', params, requestOption);
    if (response.Code === 500) {
      // endpoint auto switch to cn-beijing
      client.endpoint = 'https://green-cip.cn-beijing.aliyuncs.com';
      response = await client.request('TextModeration', params, requestOption);
    }
  } catch (err) {
    console.log(err);
  }
  return response;
}

export default { nicknameDetection };
