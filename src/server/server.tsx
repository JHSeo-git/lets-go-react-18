/**
 * @see https://minoo.medium.com/react-typescript-ssr-code-splitting-%ED%99%98%EA%B2%BD%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0-d8cec9567871
 * @see https://github.com/DylanJu/react-pure-ssr/blob/master/src/server.tsx
 */
import path from 'path';
import express from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import { ChunkExtractor } from '@loadable/server';
import { renderHTMLJSX, renderHTMLString } from './render/renderHTML';

const development = process.env.NODE_ENV !== 'production';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ?? 3003;
const app = express();

if (development) {
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('../../webpack/webpack.ssr.client.js');

  const compiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig[0].output.publicPath,
      serverSideRender: true,
      writeToDisk: true,
      stats: 'errors-only',
    })
  );
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.resolve(__dirname)));
app.get('*', (req, res) => {
  const nodeStats = path.resolve(__dirname, './node/loadable-stats.json');
  const webStats = path.resolve(__dirname, './web/loadable-stats.json');
  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
  const webExtractor = new ChunkExtractor({ statsFile: webStats });
  const { default: App } = nodeExtractor.requireEntrypoint();

  const appJSX = webExtractor.collectChunks(
    <StaticRouter location={req.url}>
      <App />
    </StaticRouter>
  );

  const htmlJSX = renderHTMLJSX({
    app: appJSX,
    links: webExtractor.getLinkElements(),
    styles: webExtractor.getStyleElements(),
    scripts: webExtractor.getScriptElements(),
  });

  const { pipe, abort } = renderToPipeableStream(htmlJSX, {
    onAllReady() {
      res.statusCode = 200;
      pipe(res);
    },
    onShellError() {
      res.status(500).send('Something went wrong');
    },
  });
  // const html = renderHTMLString({
  //   app: appJSX,
  //   links: webExtractor.getLinkElements(),
  //   styles: webExtractor.getStyleElements(),
  //   scripts: webExtractor.getScriptElements(),
  // });

  // res.status(200).send(html);
});

app
  .listen(port, () => {
    console.info(`✅  Server is running at http://${host}:${port}`);
  })
  .on('error', (err: NodeJS.ErrnoException) => {
    if (err.syscall !== 'listen') {
      throw err;
    }

    const isPipe = (portOrPipe: unknown) => Number.isNaN(portOrPipe);

    const bind = isPipe(port) ? 'Pipe ' + port : 'Port ' + port;

    switch (err.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;

      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;

      default:
        throw err;
    }
  });
