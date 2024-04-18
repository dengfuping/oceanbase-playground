export default [
  {
    path: 'oceanbase-with-flink/order',
    component: 'OceanbaseWithFlink/Order',
  },
  {
    path: 'oceanbase-with-flink/new-order',
    component: 'OceanbaseWithFlink/NewOrder',
  },
  {
    path: '/',
    component: 'Layout',
    routes: [
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
