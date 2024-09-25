import type { AppProps } from 'next/app';
import { ConfigProvider } from '@oceanbase/design';
import { IntlProvider } from 'react-intl';
import '@/styles/globals.less';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider>
      <IntlProvider locale="zh-CN">
        <Component {...pageProps} />
      </IntlProvider>
    </ConfigProvider>
  );
}
