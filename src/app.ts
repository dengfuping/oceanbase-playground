import type { RequestConfig } from 'umi';
import { message } from '@oceanbase/design';

export const request: RequestConfig = {
  errorConfig: {
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) {
        throw error;
      }
      if (error.response) {
        const { errorMessage } = error.response?.data || {};
        // request success, response failed (status code !== 2xx)
        message.error(`Response error: ${errorMessage}`);
      } else if (error.request) {
        // request success, none response
        message.error('None response! Please retry.');
      } else {
        // request error
        message.error('Request error, please retry.');
      }
    },
  },
};
