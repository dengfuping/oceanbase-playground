import { join } from 'path';
import express from 'express';
import morgan from 'morgan';
import type { IApi } from 'umi';
import { matchApiRoute } from '@umijs/preset-umi/dist/features/apiRoute/utils';

export default (api: IApi) => {
  api.describe({
    enableBy() {
      return api.name === 'start';
    },
  });

  api.registerCommand({
    name: 'start',
    description: 'start umi built app',
    details: `
umi start

# start with specified port
PORT=8888 umi start
`,
    async fn() {
      const OUTPUT_PATH = 'api';
      const port = process.env.PORT || 8000;

      const app = express();
      app.set('view engine', 'html');
      app.use(
        morgan('common', {
          skip: function (req, res) {
            return res.statusCode < 400;
          },
        }),
      );

      const staticDir = join(__dirname, 'dist');
      app.use(express.static(staticDir));

      app.all('/*', async (req, res, next) => {
        if (req.path.startsWith('/api')) {
          const path = req.path.replace('/api', '');
          const apiRoutes = Object.keys(api.appData.apiRoutes).map(
            (k) => api.appData.apiRoutes[k],
          );
          const matchedApiRoute = matchApiRoute(apiRoutes, path);

          if (!matchedApiRoute) {
            console.warn(`404 - ${req.path}`);
            next();
            return;
          }

          await require(join(
            api.paths.cwd,
            OUTPUT_PATH,
            matchedApiRoute.route.file!,
          ).replace('.ts', '.js')).default(req, res);
          next();
          return;
        } else {
          res.sendFile('index.html', { root: staticDir });
        }
      });

      app.listen(port, () => {
        console.log(`Umi app listening on port ${port}`);
      });
    },
  });
};
