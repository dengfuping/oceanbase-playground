export default [
  {
    path: '/',
    component: 'Layout',
    routes: [
      {
        path: 'oceanbase-with-flink/order',
        component: 'OceanbaseWithFlink/Order',
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
            component: 'OceanbaseWithFlink',
          },
        ],
      },
    ],
  },
];
