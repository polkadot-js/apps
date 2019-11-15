// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import useApiContext from './apiContext';

// create a chain-specific key for the local cache
export default function useCacheKey (storageKeyBase: string): string {
  const { api, isDevelopment } = useApiContext();

  return `${storageKeyBase}:${isDevelopment ? 'development' : api.genesisHash}`;
}
