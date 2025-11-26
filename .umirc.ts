import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  favicons: [
    'https://mdn.alipayobjects.com/huamei_n8rchn/afts/img/A*d_ZTR7sdVzAAAAAAAAAAAAAADvSFAQ/original',
  ],
  headScripts: [
    'https://g.alicdn.com/AWSC/et/1.76.3/et_f.js',
    'https://g.alicdn.com/AWSC/Bee/index.js',
  ],
  routes,
  npmClient: 'pnpm',
  devtool: 'cheap-module-source-map',
  // Enable API route and deploy to vercel
  apiRoute: {
    platform: 'vercel',
  },
  plugins: [
    '@umijs/plugins/dist/request',
    '@umijs/plugins/dist/locale',
    '@umijs/plugins/dist/analytics',
    './umi-plugin-start.ts',
  ],
  request: {
    dataField: '',
  },
  locale: {
    // use navigator.language as default locale
    baseNavigator: true,
    default: 'en-US',
    baseSeparator: '-',
  },
  analytics: {
    ga_v2: 'G-S5LJS5FZPH',
  },
  esbuildMinifyIIFE: true,
  jsMinifierOptions: {
    target: ['chrome80', 'es2020'],
  },
  metas: [
    {
      property: 'og:site_name',
      content: 'OceanBase Playground',
    },
    {
      'data-rh': 'keywords',
      property: 'og:image',
      content:
        'https://mdn.alipayobjects.com/huamei_n8rchn/afts/img/A*d_ZTR7sdVzAAAAAAAAAAAAAADvSFAQ/original',
    },
    {
      property: 'og:description',
      content: 'OceanBase playground and demo',
    },
    {
      name: 'keywords',
      content:
        'OceanBase,oceanbase,OceanBase Playground,oceanbase playground,playground,demo,olap,flink,car order,汽车下单,实时分析,流处理,流式处理',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent',
    },
  ],
});
