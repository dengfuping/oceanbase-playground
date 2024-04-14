import { Alert, ConfigProvider } from '@oceanbase/design';
import enUS from '@oceanbase/ui/es/locale/en-US';
import zhCN from '@oceanbase/ui/es/locale/zh-CN';
// 主要用于中断请求的 API AbortController 在低版本浏览器下能正常使用
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import React from 'react';
import { getLocale, Outlet } from 'umi';
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
    <ConfigProvider locale={localeMap[locale] || enUS}>
      <ErrorBoundary>
        <BlankLayout>
          <Outlet />
        </BlankLayout>
      </ErrorBoundary>
    </ConfigProvider>
  );
};

export default Layout;
