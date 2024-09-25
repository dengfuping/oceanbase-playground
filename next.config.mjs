import withLess from 'next-with-less';
import removeImports from 'next-remove-imports';

const removeImportsFn = removeImports({
  test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
  matchImports: '\\.(less|css|scss|sass|styl)$',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // i18n: {
  //   locales: ['en-US', 'zh-CN'],
  //   defaultLocale: 'en-US',
  // },
  transpilePackages: [
    '@oceanbase',
    'query-string',
    '@ant-design',
    '@ant-design/cssinjs',
  ],
  experimental: {
    esmExternals: 'loose',
  },
};

export default withLess(nextConfig);
