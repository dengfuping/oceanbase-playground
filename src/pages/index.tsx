import Head from 'next/head';
import { Alert, ConfigProvider } from '@oceanbase/design';
import enUS from '@oceanbase/design/es/locale/en-US';
import zhCN from '@oceanbase/design/es/locale/zh-CN';
import { useRouter } from 'next/router';

const { ErrorBoundary } = Alert;

export interface HomeProps {
  children: React.ReactElement;
}
export type Locale = 'en-US' | 'zh-CN';

export default function Home({ children }: HomeProps) {
  const { locale = 'en-US' } = useRouter();
  const localeMap = {
    'en-US': enUS,
    'zh-CN': zhCN,
  };
  return (
    <>
      <ConfigProvider
        locale={localeMap[locale as Locale] || enUS}
        theme={{
          token: {
            colorSuccess: '#07C846',
            colorSuccessBg: '#F6FFED',
          },
        }}
      >
        <ErrorBoundary>
          <Head>
            <title>OceanBase Playground</title>
            <meta name="description" content="Generated by create next app" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link
              rel="icon"
              href="https://mdn.alipayobjects.com/huamei_n8rchn/afts/img/A*d_ZTR7sdVzAAAAAAAAAAAAAADvSFAQ/original"
            />
          </Head>
          <div
            style={{
              height: '100%',
              minHeight: '100%',
              backgroundColor: '#ffffff',
            }}
          >
            {children}
          </div>
        </ErrorBoundary>
      </ConfigProvider>
    </>
  );
}