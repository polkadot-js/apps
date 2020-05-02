// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import languageCache from './cache';

type Callback = (error: string | null, data: any) => void;

export default class Backend {
  type = 'backend'

  static type: 'backend' = 'backend'

  async read (lng: string, _namespace: string, responder: Callback): Promise<void> {
    if (!languageCache[lng]) {
      try {
        const response = await fetch(`locales/${lng}/translation.json`, {});

        if (!response.ok) {
          return responder(`i18n: failed loading ${lng}`, response.status >= 500 && response.status < 600);
        }

        languageCache[lng] = await response.json();
      } catch (error) {
        return responder(error.message, false);
      }
    }

    return responder(null, languageCache[lng]);
  }
}
