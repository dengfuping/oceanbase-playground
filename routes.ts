export default [
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
