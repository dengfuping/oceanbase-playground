import { Layout, theme } from '@oceanbase/design';
import React from 'react';
import { Outlet } from 'umi';
import styles from './index.less';

const BlankLayout: React.FC = (props) => {
  const { token } = theme.useToken();
  return (
    <div className={styles.main} {...props}>
      <Layout className={styles.layout} style={{ backgroundColor: '#F9FAFE' }}>
        <Outlet />
      </Layout>
    </div>
  );
};

export default BlankLayout;
