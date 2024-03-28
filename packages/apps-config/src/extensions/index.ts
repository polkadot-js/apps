// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Browser, Extension, Known } from './types.js';

import { initPolkadotSnap } from '@chainsafe/metamask-polkadot-adapter/build/extension';
import { catchError, firstValueFrom, from, of, timeout, zip } from 'rxjs';

import { PolkadotJs } from './polkadot-js.js';

// The list of known extensions including the links to tem on the store. This is
// used when no extensions are actually available, promoting the user to install
// one or more (Any known extension can and should be added here)

export const knownExtensions: Record<string, Known> = {
  'polkadot-js': PolkadotJs
};

export const availableExtensions = Object
  .values(knownExtensions)
  .reduce((available: Record<Browser, Extension[]>, { all, desc, name }) => {
    Object.entries(all).forEach(([browser, link]): void => {
      available[browser as Browser].push({ desc, link, name });
    });

    return available;
  }, { chrome: [], firefox: [] });

// Some extensions do not use `@polkadot/extension-inject` and need to be manually inject into a window context
export function injectExtensions (): Promise<boolean[]> {
  return firstValueFrom(zip([
    initPolkadotSnap
  ].map((method) => firstValueFrom(from(method({})).pipe(
    timeout(1000), // timeout if method() doesn't resolve after 1s
    catchError(() => of(false))
  )))));
}
