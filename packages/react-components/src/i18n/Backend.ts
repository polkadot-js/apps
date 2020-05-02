// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

type Callback = (error: string | null, data: any) => void;

export const languageCache: Record<string, any> = {};

export default class Backend {
  type = 'backend'

  static type: 'backend' = 'backend'

  async read (lng: string, _namespace: string, responder: Callback): Promise<void> {
    const url = `locales/${lng}/translation.json`;
    const cached = languageCache[url];

    if (cached) {
      responder(null, cached);

      return;
    }

    try {
      const response = await fetch(url, {});
      const { ok, status } = response;

      if (!ok) {
        responder(`failed loading ${url}`, status >= 500 && status < 600);

        return;
      }

      const data = await response.json();

      languageCache[url] = data;

      return responder(null, data);
    } catch (error) {
      responder(error.message, false);
    }
  }

  create (): void {
    // no creation
  }
}
