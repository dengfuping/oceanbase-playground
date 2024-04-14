import React from 'react';
import { Outlet, useLocation } from 'umi';
import './index.less';

const BasicLayout: React.FC<any> = (props) => {
  const { pathname } = useLocation();

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default BasicLayout;
