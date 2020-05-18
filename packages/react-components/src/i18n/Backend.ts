// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import languageCache from './cache';

type Callback = (error: string | null, data: any) => void;

type LoadResult = [string | null, any];

const loaders: Record<string, Promise<LoadResult>> = {};

export default class Backend {
  type = 'backend'

  static type: 'backend' = 'backend'

  async read (lng: string, _namespace: string, responder: Callback): Promise<void> {
    if (languageCache[lng]) {
      return responder(null, languageCache[lng]);
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!loaders[lng]) {
      loaders[lng] = this.createLoader(lng);
    }

    const [error, data] = await loaders[lng];

    return responder(error, data);
  }

  async createLoader (lng: string): Promise<LoadResult> {
    try {
      const response = await fetch(`locales/${lng}/translation.json`, {});

      if (!response.ok) {
        return [`i18n: failed loading ${lng}`, response.status >= 500 && response.status < 600];
      } else {
        languageCache[lng] = await response.json();

        return [null, languageCache[lng]];
      }
    } catch (error) {
      return [error.message, false];
    }
  }
}
