type AssetsManifest = {
  files: {
    [key: string]: string;
  };
  entrypoints: string[];
};

export const assetsParser = (manifest: AssetsManifest) => {
  const { files, entrypoints } = manifest;

  const getLinkElements = () =>
    entrypoints.map((key) => {
      const href = files[key];
      const as = key.endsWith('.css') ? 'style' : 'script';

      return <link key={key} rel="preload" href={href} as={as} />;
    });

  const getStyleElements = () =>
    Object.keys(files)
      .filter((key) => key.endsWith('.css') && !key.endsWith('.module.css'))
      .map((key) => {
        return <link key={key} rel="stylesheet" href={files[key]} />;
      });

  const getScriptElements = () =>
    Object.keys(files)
      .filter((key) => key.endsWith('.js'))
      .map((key) => {
        return <script key={key} async src={files[key]}></script>;
      });

  return { getLinkElements, getStyleElements, getScriptElements };
};
