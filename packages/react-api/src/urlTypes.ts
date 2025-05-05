// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { unzlibSync, zlibSync } from 'fflate';
import queryString from 'query-string';

import { settings } from '@polkadot/ui-settings';
import { assert, stringToU8a, u8aToString } from '@polkadot/util';
import { base64Decode, base64Encode } from '@polkadot/util-crypto';

export function decodeUrlTypes (): Record<string, any> | null {
  const urlOptions = queryString.parse(location.href.split('?')[1]);

  if (urlOptions.types) {
    try {
      assert(!Array.isArray(urlOptions.types), 'Expected a single type specification');

      const parts = urlOptions.types.split('#');
      const compressed = base64Decode(decodeURIComponent(parts[0]));
      const uncompressed = unzlibSync(compressed);

      return JSON.parse(u8aToString(uncompressed)) as Record<string, any>;
    } catch (error) {
      console.error(error);
    }
  }

  return null;
}

export function encodeUrlTypes (types: Record<string, any>): string {
  const jsonU8a = stringToU8a(JSON.stringify(types));
  const compressed = zlibSync(jsonU8a, { level: 9 });
  const encoded = base64Encode(compressed);

  return `${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(settings.apiUrl)}&types=${encodeURIComponent(encoded)}`;
}
