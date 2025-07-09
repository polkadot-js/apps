// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/x-textencoder/shim';
import '@polkadot/x-textdecoder/shim';

import type { CallOptions } from './types.js';

import { useEffect, useMemo, useState } from 'react';

import { useIsMountedRef } from './useIsMountedRef.js';

interface Options <T> extends CallOptions<T> {
  transform?: (value: any) => T
}

export function normalizeMetadataLink (link?: string): string {
  if (!link) {
    return '';
  } else if (link.toLowerCase().startsWith('http')) {
    return link;
  }

  // handle V0 CID
  const matchCidV0 = link.match(/Qm[A-Za-z0-9]{44}(?![A-Za-z0-9])/);

  if (matchCidV0 !== null) {
    return matchCidV0[0];
  }

  // handle V1 CID
  const matchCidV1 = link.match(/[a-z0-9]{59}(?![A-Za-z0-9])/);

  if (matchCidV1 !== null) {
    return matchCidV1[0];
  }

  return '';
}

const cache = new Map<string, any>();

async function fetchMetadata <T> (metadataLinks: string[]): Promise<Map<string, T>> {
  const result = new Map();

  const promises = metadataLinks.map((metadataLink) => {
    if (cache.has(metadataLink)) {
      result.set(metadataLink, cache.get(metadataLink));

      return Promise.resolve();
    }

    const fetchLink = metadataLink.startsWith('http') ? metadataLink : `https://ipfs.io/ipfs/${metadataLink}`;

    return fetch(fetchLink)
      .then(async (res) => {
        const response = res.status >= 200 && res.status < 300 ? await res.text() : null;

        cache.set(metadataLink, response);
        result.set(metadataLink, response);
      });
  });

  await Promise.allSettled(promises);

  return result;
}

function postProcessData <T> (fetchedMetadata: Map<string, T>, { transform }: Options<T> = {}) {
  if (!transform) {
    return fetchedMetadata;
  }

  for (const [key, value] of fetchedMetadata.entries()) {
    fetchedMetadata.set(key, transform(value));
  }

  return fetchedMetadata;
}

// FIXME This is generic, we cannot really use createNamedHook
export function useMetadataFetch <T> (rawLinks: string[] | undefined, options?: Options<T>): Map<string, T> | undefined {
  const mountedRef = useIsMountedRef();
  const [value, setValue] = useState<Map<string, T> | undefined>();

  const metadataLinks = useMemo(() => {
    if (!rawLinks) {
      return undefined;
    }

    return rawLinks
      .map((hash) => normalizeMetadataLink(hash))
      .filter((hash) => !!hash);
  }, [rawLinks]);

  useEffect((): void => {
    if (mountedRef.current && metadataLinks) {
      fetchMetadata<T>(metadataLinks)
        .then((fetchedMetadata) => setValue(postProcessData<T>(fetchedMetadata, options)))
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => { });
    }
  }, [metadataLinks, options, mountedRef]);

  return value;
}
