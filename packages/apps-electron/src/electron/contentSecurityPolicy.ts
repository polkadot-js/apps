// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HeadersReceivedResponse, session } from 'electron';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const setupContentSecurityPolicy = (_: string): void => {
  session.defaultSession.webRequest.onHeadersReceived((details, cb: (headersReceivedResponse: HeadersReceivedResponse) => void) => {
    const headersReceivedResponse = {
      responseHeaders: {
        ...details.responseHeaders,
        // unsafe-eval is needed for the WASM content - same as the extension
        // script hash here is for the window.top script (not technically needed)
        'Content-Security-Policy': ["default-src 'self' 'unsafe-eval' 'sha256-02/ejyoV/iwRdJ4NAsxjzF6WVUtLMPM6Nv96EbAm6u8=';" +
        " style-src-elem 'self' https://fonts.googleapis.com/css 'unsafe-inline';" +
        " font-src data: 'self' https://fonts.gstatic.com;" +
        " style-src 'unsafe-inline';" +
        " connect-src 'self' wss:;" +
        " img-src 'self' data:"]
      }
    };

    cb(headersReceivedResponse);
  });
};
