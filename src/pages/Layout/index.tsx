import { Alert, ConfigProvider } from '@oceanbase/design';
import enUS from '@oceanbase/design/es/locale/en-US';
import zhCN from '@oceanbase/design/es/locale/zh-CN';
import React from 'react';
import { getLocale, Helmet, Outlet } from 'umi';
import BlankLayout from './BlankLayout';

const { ErrorBoundary } = Alert;

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  const locale = getLocale();
  const localeMap = {
    'en-US': enUS,
    'zh-CN': zhCN,
  };

  return (
    <ConfigProvider
      locale={localeMap[locale] || enUS}
      theme={{
        token: {
          colorText: 'rgba(0, 0, 0, 0.85)',
          colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
          colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
          borderRadius: 4,
          colorBorder: '#ebedf0',
          colorPrimary: '#217eff',
          colorSuccess: '#00c483',
        },
        components: {
          Form: {
            controlHeight: 40,
          },
        },
      }}
    >
      <ErrorBoundary>
        <Helmet>
          <title>OceanBase Playground</title>
        </Helmet>
        <BlankLayout>
          <Outlet />
        </BlankLayout>
      </ErrorBoundary>
    </ConfigProvider>
  );
};

export default Layout;
