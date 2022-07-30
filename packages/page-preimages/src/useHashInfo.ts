// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes, Option } from '@polkadot/types';
import type { PalletPreimageRequestStatus } from '@polkadot/types/lookup';
import type { HexString } from '@polkadot/util/types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  bytes: Bytes | null;
  status: PalletPreimageRequestStatus | null;
}

function createResult (preimage: Option<Bytes>, status: Option<PalletPreimageRequestStatus>): Result {
  return {
    bytes: preimage.unwrapOr(null),
    status: status.unwrapOr(null)
  };
}

function useHashInfoImpl (hash: HexString): Result | undefined {
  const { api } = useApi();
  const preimage = useCall<Option<Bytes>>(api.query.preimage.preimageFor, [hash]);
  const status = useCall<Option<PalletPreimageRequestStatus>>(api.query.preimage.statusFor, [hash]);

  return useMemo(
    () => preimage && status && createResult(preimage, status),
    [preimage, status]
  );
}

export default createNamedHook('useHashInfo', useHashInfoImpl);
