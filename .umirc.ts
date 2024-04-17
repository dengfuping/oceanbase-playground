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
  // Enable API route and deploy to vercel
  apiRoute: {
    platform: 'vercel',
  },
  plugins: ['@umijs/plugins/dist/request', '@umijs/plugins/dist/locale'],
  request: {
    dataField: '',
  },
  locale: {
    // 默认使用 src/locales/en-US.ts 作为多语言文件
    default: 'en-US',
    baseSeparator: '-',
  },
  esbuildMinifyIIFE: true,
});
