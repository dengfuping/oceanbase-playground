import { Layout } from '@oceanbase/design';
import React from 'react';
import { Outlet } from 'umi';
import styles from './index.less';

const BlankLayout: React.FC = (props) => (
  <div className={styles.main} {...props}>
    <Layout className={styles.layout}>
      <Outlet />
    </Layout>
  </div>
);

export default BlankLayout;
