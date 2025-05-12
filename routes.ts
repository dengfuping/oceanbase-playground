export default [
  {
    path: '/',
    component: 'Layout',
    routes: [
      {
        path: 'oceanbase-with-flink/order',
        component: 'OceanBaseWithFlink/Order',
      },
      {
        path: '/',
        component: 'Layout/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/oceanbase-with-flink',
          },
          {
            path: 'oceanbase-with-flink',
            component: 'OceanBaseWithFlink',
          },
          {
            path: 'readonly-column-store-replica',
            component: 'OceanBaseWithFlink',
          },
          {
            path: 'row-store',
            component: 'OceanBaseWithFlink',
          },
        ],
      },
    ],
  },
];
