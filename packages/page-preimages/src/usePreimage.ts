// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Bytes, Option } from '@polkadot/types';
import type { Call, Hash } from '@polkadot/types/interfaces';
import type { FrameSupportPreimagesBounded, PalletPreimageRequestStatus } from '@polkadot/types/lookup';
import type { HexString } from '@polkadot/util/types';
import type { Preimage } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { isBn, isString } from '@polkadot/util';

function createResult (api: ApiPromise, optStatus: Option<PalletPreimageRequestStatus>, optBytes: Option<Bytes>): Preimage {
  const status = optStatus.unwrapOr(null);
  const bytes = optBytes.unwrapOr(null);
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
    const req = status.asRequested;

    // the original version has asRequested as the actual count
    // (current/later versions has it as a structure)
    count = isBn(req)
      ? req.toNumber()
      : req.count.toNumber();
  }

  return {
    bytes,
    count,
    proposal,
    status
  };
}

function getParams (hash: Hash | HexString, optStatus: Option<PalletPreimageRequestStatus>): unknown[] {
  const status = optStatus.unwrapOr(null);

  return [
    status
      ? status.isRequested
        ? [hash, status.asRequested.len.unwrapOr(0)]
        : [hash, status.asUnrequested.len]
      : [hash, 0]
  ];
}

export function getPreimageHash (hashOrBounded: Hash | HexString | FrameSupportPreimagesBounded): HexString {
  if (isString(hashOrBounded)) {
    return hashOrBounded;
  }

  const bounded = hashOrBounded as FrameSupportPreimagesBounded;

  return bounded.isInline
    ? bounded.asInline.hash.toHex()
    : bounded.isLegacy
      ? bounded.asLegacy.hash_.toHex()
      : bounded.isLookup
        ? bounded.asLookup.hash_.toHex()
        : hashOrBounded.toHex();
}

function usePreimageImpl (hashOrBounded: Hash | HexString | FrameSupportPreimagesBounded): Preimage | undefined {
  const { api } = useApi();

  const hash = useMemo(
    () => getPreimageHash(hashOrBounded),
    [hashOrBounded]
  );

  const optStatus = useCall<Option<PalletPreimageRequestStatus>>(api.query.preimage.statusFor, [hash]);

  const params = useMemo(
    () => optStatus && getParams(hash, optStatus),
    [hash, optStatus]
  );

  const optBytes = useCall<Option<Bytes>>(params && api.query.preimage.preimageFor, params);

  console.error(hashOrBounded, typeof hashOrBounded, params, optBytes, optStatus);

  return useMemo(
    () => optBytes && optStatus && createResult(api, optStatus, optBytes),
    [api, optBytes, optStatus]
  );
}

export default createNamedHook('usePreimage', usePreimageImpl);
