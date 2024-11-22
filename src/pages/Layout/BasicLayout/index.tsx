import React from 'react';
import { Outlet } from 'umi';
import './index.less';

const BasicLayout: React.FC<any> = () => {
  return (
    <div
      style={{
        minWidth: 1080,
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Outlet />
    </div>
  );
};

export default BasicLayout;
