import { renderToStaticMarkup } from 'react-dom/server';

type RenderHTMLProps = {
  app: React.ReactNode;
  links?: React.ReactNode[];
  styles?: React.ReactNode[];
  scripts?: React.ReactNode[];
};

export const renderHTMLJSX = ({
  app,
  links,
  styles,
  scripts,
}: RenderHTMLProps) => {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {links}
        {styles}
        <title>Let&apos;s go React 18 with SSR</title>
      </head>
      <body>
        <div id="app">{app}</div>
        {scripts}
      </body>
    </html>
  );

  // return `<!DOCTYPE html>${renderToStaticMarkup(html)}`;
};

export const renderHTMLString = ({
  app,
  links,
  styles,
  scripts,
}: RenderHTMLProps) => {
  const html = (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {links}
        {styles}
        <title>Let&apos;s go React 18 with SSR</title>
      </head>
      <body>
        <div id="app">{app}</div>
        {scripts}
      </body>
    </html>
  );

  return `<!DOCTYPE html>${renderToStaticMarkup(html)}`;
};
