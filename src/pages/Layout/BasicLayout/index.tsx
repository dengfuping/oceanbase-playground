import React from 'react';
import { Outlet } from 'umi';
import './index.less';

const BasicLayout: React.FC<any> = () => {
  return (
    <div style={{ minWidth: 1080 }}>
      <Outlet />
    </div>
  );
};

export default BasicLayout;
