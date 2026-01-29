// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { createNamedHook } from './createNamedHook.js';

interface Result {
  ipfsHash: string;
  ipfsShort: string;
  ipfsUrl: string;
}

function useIpfsLinkImpl (ipfsHash?: string | null): Result | null {
  return useMemo(
    () => ipfsHash
      ? {
        ipfsHash,
        ipfsShort: `${ipfsHash.substring(0, 4)}…${ipfsHash.slice(-4)}`,
        // ipfsUrl: `https://cloudflare-ipfs.com/ipfs/${ipfs}`
        ipfsUrl: `https://ipfs.io/ipfs/${ipfsHash}`
      }
      : null,
    [ipfsHash]
  );
}

export const useIpfsLink = createNamedHook('useIpfsLink', useIpfsLinkImpl);
