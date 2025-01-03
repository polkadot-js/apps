// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeadersReceivedResponse } from 'electron';

import { session } from 'electron';

export function setupContentSecurityPolicy (_: string): void {
  session.defaultSession.webRequest.onHeadersReceived((details, respond: (response: HeadersReceivedResponse) => void) => {
    respond({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self';" +
          " style-src-elem 'self' https://fonts.googleapis.com/css 'unsafe-inline';" +
          " font-src data: 'self' https://fonts.gstatic.com;" +
          " style-src 'unsafe-inline';" +
          " connect-src 'self' wss: ws:;" +
          " img-src 'self' data:;" +
          // react-qr-reader uses an embedded blob
          " worker-src 'self' blob: filesystem:;" +
          // unsafe-eval is needed for the WASM content - same as the extension
          // script hashes here are for the window.top script (not technically needed)
          " script-src 'self' 'unsafe-eval' 'sha256-02/ejyoV/iwRdJ4NAsxjzF6WVUtLMPM6Nv96EbAm6u8=' 'sha256-wW/WsLudCDaPo/ibpeK0KslHqYpCzcAKNFxFBXwCHJg='"
        ]
      }
    });
  });
}
