// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { HeadersReceivedResponse, session } from 'electron';

export const setupContentSecurityPolicy = (environment: string): void => {
  session.defaultSession.webRequest.onHeadersReceived((details, cb: (headersReceivedResponse: HeadersReceivedResponse) => void) => {
    const headersReceivedResponse = {
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [`default-src 'self' ${environment === 'development' ? "'unsafe-eval'" : ''};` +
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
