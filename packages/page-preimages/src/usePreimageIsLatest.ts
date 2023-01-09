// Copyright 2017-2023 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';

function usePreimageIsLatestImpl (): boolean {
  const { api } = useApi();

  // retrieve the status using only the hash of the image
  return useMemo(
    // we need to be on the newest supported version of the pallet
    // (after the application of bounded calls)
    () => !!(
      api.query.preimage &&
      api.query.preimage.preimageFor?.creator.meta.type.isMap &&
      api.query.preimage.preimageFor.creator.meta.type.isMap &&
      api.registry.lookup.getTypeDef(api.query.preimage.preimageFor.creator.meta.type.asMap.key).type === '(H256,u32)'
    ),
    [api]
  );
}

export default createNamedHook('usePreimageIsLatest', usePreimageIsLatestImpl);
