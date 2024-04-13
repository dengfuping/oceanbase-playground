import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
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
