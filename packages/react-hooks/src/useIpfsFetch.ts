// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/x-textencoder/shim';
import '@polkadot/x-textdecoder/shim';

import type { CallOptions } from './types.js';

import * as isIPFS from 'is-ipfs';
import { useEffect, useMemo, useState } from 'react';

import { useIsMountedRef } from './useIsMountedRef.js';

interface Options <T> extends CallOptions<T> {
  transform?: (value: any) => T
}

function isCid (cid: string): boolean {
  return !!cid && (isIPFS.cid(cid) || isIPFS.base32cid(cid.toLowerCase()));
}

const cache = new Map<string, any>();

async function fetchIpfsData <T> (ipfsHashes: string[]): Promise<Map<string, T>> {
  const result = new Map();

  const promises = ipfsHashes.map((ipfsHash) => {
    if (cache.has(ipfsHash)) {
      result.set(ipfsHash, cache.get(ipfsHash));

      return Promise.resolve();
    }

    return fetch(`https://ipfs.io/ipfs/${ipfsHash}`)
      .then(async (res) => {
        const ipfsResponse = res.status >= 200 && res.status < 300 ? await res.text() : null;

        cache.set(ipfsHash, ipfsResponse);
        result.set(ipfsHash, ipfsResponse);
      });
  });

  await Promise.allSettled(promises);

  return result;
}

function postProcessData <T> (ipfsData: Map<string, T>, { transform }: Options<T> = {}) {
  if (!transform) {
    return ipfsData;
  }

  for (const [key, value] of ipfsData.entries()) {
    ipfsData.set(key, transform(value));
  }

  return ipfsData;
}

// FIXME This is generic, we cannot really use createNamedHook
export function useIpfsFetch <T> (hashes: string[] | undefined, options?: Options<T>): Map<string, T> | undefined {
  const mountedRef = useIsMountedRef();
  const [value, setValue] = useState<Map<string, T> | undefined>();

  const ipfsHashes = useMemo(() => {
    if (!hashes) {
      return undefined;
    }

    return hashes
      .map((hash) => isCid(hash) ? hash : '')
      .filter((hash) => !!hash);
  }, [hashes]);

  useEffect((): void => {
    if (mountedRef.current && ipfsHashes) {
      fetchIpfsData<T>(ipfsHashes)
        .then((ipfsData) => setValue(postProcessData<T>(ipfsData, options)))
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => { });
    }
  }, [ipfsHashes, options, mountedRef]);

  return value;
}
