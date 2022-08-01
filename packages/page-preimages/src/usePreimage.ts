// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Bytes, Option } from '@polkadot/types';
import type { Call, Hash } from '@polkadot/types/interfaces';
import type { PalletPreimageRequestStatus } from '@polkadot/types/lookup';
import type { HexString } from '@polkadot/util/types';
import type { Preimage } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function createResult (api: ApiPromise, preimage: Option<Bytes>, optStatus: Option<PalletPreimageRequestStatus>): Preimage {
  const bytes = preimage.unwrapOr(null);
  const status = optStatus.unwrapOr(null);
  let count = 0;
  let proposal: Call | null = null;

  if (bytes) {
    try {
      proposal = api.registry.createType('Call', bytes.toU8a(true));
    } catch (error) {
      console.error(error);
    }
  }

  if (status && status.isRequested) {
    count = status.asRequested.toNumber();
  }

  return {
    bytes,
    count,
    proposal,
    status
  };
}

function usePreimageImpl (hash: Hash | HexString): Preimage | undefined {
  const { api } = useApi();
  const preimage = useCall<Option<Bytes>>(api.query.preimage.preimageFor, [hash]);
  const status = useCall<Option<PalletPreimageRequestStatus>>(api.query.preimage.statusFor, [hash]);

  return useMemo(
    () => preimage && status && createResult(api, preimage, status),
    [api, preimage, status]
  );
}

export default createNamedHook('usePreimage', usePreimageImpl);
