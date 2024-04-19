import React from 'react';
import { Outlet } from 'umi';
import './index.less';

const BasicLayout: React.FC<any> = (props) => {
  return (
    <div style={{ minWidth: 1540 }}>
      <Outlet />
    </div>
  );
};

export default BasicLayout;
