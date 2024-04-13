import { BasicLayout as OBUIBasicLayout } from '@oceanbase/ui';
import React from 'react';
import { Outlet, useLocation } from 'umi';
import './index.less';

type BasicLayoutProps = OBUIBasicLayoutProps;

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { pathname } = useLocation();

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default BasicLayout;
