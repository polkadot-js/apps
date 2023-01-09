// Copyright 2017-2023 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Bytes, Option } from '@polkadot/types';
import type { Call, Hash } from '@polkadot/types/interfaces';
import type { FrameSupportPreimagesBounded, PalletPreimageRequestStatus } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { Preimage, PreimageDeposit, PreimageStatus } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO, formatNumber, isString, objectSpread } from '@polkadot/util';

type BytesParams = [[proposalHash: HexString, proposalLength: BN]];

interface InterimResult {
  paramsBytes?: BytesParams;
  preimageStatus?: PreimageStatus;
}

function createResult (api: ApiPromise, preimageStatus: PreimageStatus, optBytes: Option<Bytes>): Preimage {
  const bytes = optBytes.unwrapOr(null);
  let proposal: Call | null = null;
  let proposalError: string | null = null;
  let proposalWarning: string | null = null;

  if (bytes) {
    try {
      proposal = api.registry.createType('Call', bytes.toU8a(true));

      const storeLength = preimageStatus.proposalLength.toNumber();
      const callLength = proposal.encodedLength;

      if (callLength !== storeLength) {
        proposalWarning = `Decoded call length does not match on-chain stored preimage length (${formatNumber(callLength)} bytes vs ${formatNumber(storeLength)} bytes)`;
      }
    } catch (error) {
      console.error(error);

      proposalError = 'Unable to decode preimage bytes into a valid Call';
    }
  } else {
    proposalWarning = 'No preimage bytes found';
  }

  return objectSpread<Preimage>({}, preimageStatus, {
    bytes,
    isCompleted: true,
    proposal,
    proposalError,
    proposalWarning,
    registry: api.registry
  });
}

function convertDeposit (deposit?: PalletPreimageRequestStatus['asUnrequested']['deposit'] | null): PreimageDeposit | undefined {
  return deposit
    ? {
      amount: deposit[1],
      who: deposit[0].toString()
    }
    : undefined;
}

function getBytesParams (api: ApiPromise, hash: Hash | HexString, optStatus: Option<PalletPreimageRequestStatus>): InterimResult {
  const status = optStatus.unwrapOr(null);
  const preimageStatus: PreimageStatus = {
    count: 0,
    isCompleted: false,
    proposalHash: isString(hash)
      ? hash
      : hash.toHex(),
    proposalLength: BN_ZERO,
    registry: api.registry,
    status
  };

  if (status) {
    if (status.isRequested) {
      const { count, deposit, len } = status.asRequested;

      preimageStatus.count = count.toNumber();
      preimageStatus.deposit = convertDeposit(deposit.unwrapOr(null));
      preimageStatus.proposalLength = len.unwrapOr(BN_ZERO);
    } else if (status.isUnrequested) {
      const { deposit, len } = status.asUnrequested;

      preimageStatus.deposit = convertDeposit(deposit);
      preimageStatus.proposalLength = len;
    } else {
      // for future reference...
      console.error('Unhandled preimage status type: ', status.type);
    }
  }

  return {
    paramsBytes: [[preimageStatus.proposalHash, preimageStatus.proposalLength]],
    preimageStatus
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

function usePreimageImpl (isLatest: boolean, hashOrBounded?: Hash | HexString | FrameSupportPreimagesBounded | null): Preimage | undefined {
  const { api } = useApi();

  // retrieve the status using only the hash of the image
  const paramsStatus = useMemo(
    // we need a hash _and_ be on the newest supported version of the pallet
    // (after the application of bounded calls)
    () => isLatest && hashOrBounded
      ? [getPreimageHash(hashOrBounded)]
      : undefined,
    [hashOrBounded, isLatest]
  );

  const optStatus = useCall<Option<PalletPreimageRequestStatus>>(paramsStatus && api.query.preimage?.statusFor, paramsStatus);

  // from the retrieved status (if any), get the on-chain stored bytes
  const { paramsBytes, preimageStatus } = useMemo(
    () => paramsStatus && optStatus
      ? getBytesParams(api, paramsStatus[0], optStatus)
      : {},
    [api, optStatus, paramsStatus]
  );

  const optBytes = useCall<Option<Bytes>>(paramsBytes && api.query.preimage?.preimageFor, paramsBytes);

  // extract all the preimage info we have retrieved
  return useMemo(
    () => preimageStatus
      ? optBytes
        ? createResult(api, preimageStatus, optBytes)
        : preimageStatus
      : undefined,
    [api, optBytes, preimageStatus]
  );
}

export default createNamedHook('usePreimage', usePreimageImpl);
