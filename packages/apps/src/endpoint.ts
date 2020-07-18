// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { isFunction } from '@polkadot/util';

function hasEndpoint (api: ApiPromise, endpoint: string): boolean {
  const [area, section, method] = endpoint.split('.');

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return isFunction((api as any)[area][section][method]);
  } catch (error) {
    return false;
  }
}

export function findMissingApis (api: ApiPromise, needsApi?: (string | string[])[]): (string | string[])[] {
  if (!needsApi) {
    return [];
  }

  return needsApi.filter((endpoint: string | string[]): boolean => {
    const hasApi = Array.isArray(endpoint)
      ? endpoint.reduce((hasApi, endpoint) => hasApi || hasEndpoint(api, endpoint), false)
      : hasEndpoint(api, endpoint);

    return !hasApi;
  });
}
