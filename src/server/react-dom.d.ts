/**
 * https://github.com/facebook/react/blob/ebd7ff65b6fea73313c210709c88224910e86339/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L76
 */

import type { ReactNode } from 'react';
import type { Writable } from 'stream';

interface Options {
  identifierPrefix?: string;
  namespaceURI?: string;
  nonce?: string;
  bootstrapScriptContent?: string;
  bootstrapScripts?: Array<string>;
  bootstrapModules?: Array<string>;
  progressiveChunkSize?: number;
  onShellReady?: () => void;
  onShellError?: () => void;
  onAllReady?: () => void;
  onError?: (error: unknown) => void;
}

interface Controls {
  pipe<T extends Writable>(destination: Writable): T;
  abort(): void;
}

declare module 'react-dom/server' {
  export function renderToPipeableStream(
    element: ReactNode,
    options?: Options
  ): Controls;
}
