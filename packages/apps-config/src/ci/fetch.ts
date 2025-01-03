// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fetch } from '@polkadot/x-fetch';

function fetchWithTimeout (url: string, timeout = 2_000): Promise<Response | null> {
  let controller: AbortController | null = new AbortController();
  let timeoutId: null | ReturnType<typeof setTimeout> = null;

  // This is a weird mess, however we seem to have issues with Jest & hanging connections
  // in the case where things are (possibly) aborted. So we just swallow/log everything
  // and return null in the cases where things don't quite go as planned
  return Promise
    .race([
      fetch(url, { signal: controller.signal }).catch((error): null => {
        console.error(error);

        return null;
      }),
      new Promise<null>((resolve): void => {
        timeoutId = setTimeout((): void => {
          timeoutId = null;
          controller?.abort();

          resolve(null);
        }, timeout);
      })
    ])
    .finally(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      controller = null;
      timeoutId = null;
    });
}

export function fetchJson <T> (url: string, timeout?: number): Promise<T | null> {
  return fetchWithTimeout(url, timeout).then<T | null>((r) => r?.json() || null);
}

export function fetchText (url: string, timeout?: number): Promise<string | null> {
  return fetchWithTimeout(url, timeout).then((r) => r?.text() || null);
}
