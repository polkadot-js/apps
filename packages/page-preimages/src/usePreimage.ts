// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Bytes, Option } from '@polkadot/types';
import type { AccountId32, Call, Hash } from '@polkadot/types/interfaces';
import type { FrameSupportPreimagesBounded, PalletPreimageRequestStatus } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { Preimage } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO, isBn, isString } from '@polkadot/util';

interface BytesParams {
  deposit: [AccountId32, BN] | null;
  params: [[hexHash: HexString, length: BN]]
}

function createResult (api: ApiPromise, optStatus: Option<PalletPreimageRequestStatus>, optBytes: Option<Bytes>, { deposit, params: [[proposalHash, proposalLength]] }: BytesParams): Preimage {
  const status = optStatus.unwrapOr(null);
  const bytes = optBytes.unwrapOr(null);
  let count = 0;
  let proposal: Call | null = null;
  let proposalError: string | null = null;
  let proposalWarning: string | null = null;

  if (bytes) {
    try {
      proposal = api.registry.createType('Call', bytes.toU8a(true));

      if (proposal.encodedLength !== proposalLength.toNumber()) {
        proposalWarning = 'Call length does not match on-chain stored preimage length';
      }
    } catch (error) {
      console.error(error);

      proposalError = 'Unable to decode preimage bytes into valid Call';
    }
  } else {
    proposalWarning = 'No preimage bytes found';
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
    deposit: deposit
      ? { amount: deposit[1], who: deposit[0].toString() }
      : undefined,
    proposal,
    proposalError,
    proposalHash,
    proposalLength,
    proposalWarning,
    registry: api.registry,
    status
  };
}

function getBytesParams (hash: Hash | HexString, optStatus: Option<PalletPreimageRequestStatus>): BytesParams {
  const status = optStatus.unwrapOr(null);
  const hexHash = isString(hash)
    ? hash
    : hash.toHex();

  if (!status) {
    return {
      deposit: null,
      params: [[hexHash, BN_ZERO]]
    };
  } else if (status.isRequested) {
    const { deposit, len } = status.asRequested;

    return {
      deposit: deposit.unwrapOr(null),
      params: [[hexHash, len.unwrapOr(BN_ZERO)]]
    };
  }

  const { deposit, len } = status.asUnrequested;

  return {
    deposit,
    params: [[hexHash, len]]
  };
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

  const paramsStatus = useMemo(
    // we need a hash _and_ be on the newest supported version of the pallet
    // (after the application of bounded calls)
    () => api.query.preimage?.preimageFor?.creator.meta.type.isMap && api.registry.lookup.getTypeDef(api.query.preimage.preimageFor.creator.meta.type.asMap.key).type === '(H256,u32)' && hashOrBounded
      ? [getPreimageHash(hashOrBounded)]
      : undefined,
    [api, hashOrBounded]
  );

  const optStatus = useCall<Option<PalletPreimageRequestStatus>>(paramsStatus && api.query.preimage?.statusFor, paramsStatus);

  const paramsBytes = useMemo(
    () => paramsStatus && optStatus
      ? getBytesParams(paramsStatus[0], optStatus)
      : undefined,
    [optStatus, paramsStatus]
  );

  const optBytes = useCall<Option<Bytes>>(paramsBytes && api.query.preimage?.preimageFor, paramsBytes && paramsBytes.params);

  return useMemo(
    () => optBytes && optStatus && paramsBytes
      ? createResult(api, optStatus, optBytes, paramsBytes)
      : undefined,
    [api, optBytes, optStatus, paramsBytes]
  );
}

export default createNamedHook('usePreimage', usePreimageImpl);
