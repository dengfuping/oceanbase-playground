## 🚀 Introduction

An OLAP Real-time Analysis Demo based on [OceanBase](https://oceanbase.com/) and [Flink](https://github.com/apache/flink).

**Live Demo**: [https://playground.oceanbase.com](https://playground.oceanbase.com)

![2024-05-09-2024-06-28 16_06_59](https://github.com/dengfuping/oceanbase-playground/assets/14918822/4dec9434-88ac-469e-91a3-5fcf22b008c0)

## ⌨️ Development

- Clone and install:

```bash
git clone git@github.com:dengfuping/oceanbase-playground.git
pnpm i
```

- Copy `.env.example` file to `.env` and configure OLTP and OLAP database url:

```bash
OLTP_DATABASE_URL=""
OLAP_DATABASE_URL=""
```

- Start demo:

```bash
pnpm run dev
```

## 🔨 Tech Stack

- [Umi.js](https://umijs.org/en-US) – Frontend React Framework
- [Umi API Route](https://umijs.org/en-US/blog/develop-blog-using-umi) - Backend API
- [TypeScript](https://www.typescriptlang.org/) – Language
- [OceanBase Design](https://github.com/oceanbase/oceanbase-design) - Design
- [OB Cloud](https://www.oceanbase.com/product/cloud) – OceanBase Cloud Database
- [Sequelize](https://sequelize.org/) - ORM
- [Vercel](https://vercel.com/) – Deployment

## ⚖️ License

MIT © [OceanBase](https://github.com/oceanbase)
