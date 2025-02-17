import 'umi/typings';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production';
      OLTP_DATABASE_URL?: string;
      OLAP_DATABASE_URL?: string;
      OLAP_READONLY_DATABASE_URL?: string;
      SECURITY_CHECK_ENABLA?: 'true' | 'false';
      SECURITY_CHECK_ACCESS_KEY: string;
      SECURITY_CHECK_ACCESS_SECRET: string;
    }
  }
}
