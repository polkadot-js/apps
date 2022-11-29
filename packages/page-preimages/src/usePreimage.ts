// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Bytes, Option } from '@polkadot/types';
import type { Call, Hash } from '@polkadot/types/interfaces';
import type { FrameSupportPreimagesBounded, PalletPreimageRequestStatus } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { Preimage } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO, isBn, isString } from '@polkadot/util';

function createResult (api: ApiPromise, optStatus: Option<PalletPreimageRequestStatus>, optBytes: Option<Bytes>, [proposalHash, proposalLength]: [HexString, BN]): Preimage {
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
    proposalHash,
    proposalLength,
    registry: api.registry,
    status
  };
}

function getParams (hash: Hash | HexString, optStatus: Option<PalletPreimageRequestStatus>): [HexString, BN] {
  const status = optStatus.unwrapOr(null);
  const hexHash = isString(hash)
    ? hash
    : hash.toHex();

  return status
    ? status.isRequested
      ? [hexHash, status.asRequested.len.unwrapOr(BN_ZERO)]
      : [hexHash, status.asUnrequested.len]
    : [hexHash, BN_ZERO];
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

function usePreimageImpl (hashOrBounded?: Hash | HexString | FrameSupportPreimagesBounded | null): Preimage | undefined {
  const { api } = useApi();

  const hash = useMemo(
    // we need a hash _and_ be on the newset supported version of the pallet
    // (after the application of bounded calls)
    () => api.query.preimage?.preimageFor?.creator.meta.type.isMap && api.registry.lookup.getTypeDef(api.query.preimage.preimageFor.creator.meta.type.asMap.key).type === '(H256,u32)' && hashOrBounded &&
      getPreimageHash(hashOrBounded),
    [api, hashOrBounded]
  );

  const optStatus = useCall<Option<PalletPreimageRequestStatus>>(hash && api.query.preimage?.statusFor, [hash]);

  const params = useMemo(
    () => hash && optStatus && getParams(hash, optStatus),
    [hash, optStatus]
  );

  const optBytes = useCall<Option<Bytes>>(params && api.query.preimage?.preimageFor, [params]);

  return useMemo(
    () => optBytes && optStatus && params
      ? createResult(api, optStatus, optBytes, params)
      : undefined,
    [api, optBytes, optStatus, params]
  );
}

export default createNamedHook('usePreimage', usePreimageImpl);
