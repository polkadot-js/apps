// Copyright 2017-2023 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Bytes } from '@polkadot/types';
import type { AccountId, Balance, Call, Hash } from '@polkadot/types/interfaces';
import type { FrameSupportPreimagesBounded, PalletPreimageRequestStatus } from '@polkadot/types/lookup';
import type { ITuple } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';
import type { Preimage, PreimageDeposit, PreimageStatus } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { BN, BN_ZERO, formatNumber, isString, objectSpread } from '@polkadot/util';

type BytesParams = [[proposalHash: HexString, proposalLength: BN]] | [proposalHash: HexString];

interface InterimResult {
  paramsBytes?: BytesParams;
  preimageStatus?: PreimageStatus;
}

type Result = 'unknown' | 'hash' | 'hashAndLen';

const OPT_STATUS = { withParamsTransform: true };

export function getParamType (api: ApiPromise): Result {
  if ((
    api.query.preimage &&
    api.query.preimage.preimageFor &&
    api.query.preimage.preimageFor.creator.meta.type.isMap
  )) {
    const { type } = api.registry.lookup.getTypeDef(api.query.preimage.preimageFor.creator.meta.type.asMap.key);

    if (type === 'H256') {
      return 'hash';
    } else if (type === '(H256,u32)') {
      return 'hashAndLen';
    } else {
      // we are clueless :()
    }
  }

  return 'unknown';
}

function createResult (api: ApiPromise, preimageStatus: PreimageStatus, optBytes: Option<Bytes>): Preimage {
  const bytes = optBytes.unwrapOr(null);
  let proposal: Call | null = null;
  let proposalError: string | null = null;
  let proposalWarning: string | null = null;
  let proposalLength: BN | undefined;

  if (bytes) {
    try {
      proposal = api.registry.createType('Call', bytes.toU8a(true));

      const callLength = proposal.encodedLength;

      if (preimageStatus.proposalLength) {
        const storeLength = preimageStatus.proposalLength.toNumber();

        if (callLength !== storeLength) {
          proposalWarning = `Decoded call length does not match on-chain stored preimage length (${formatNumber(callLength)} bytes vs ${formatNumber(storeLength)} bytes)`;
        }
      } else {
        // for the old style, we set the actual length
        proposalLength = new BN(callLength);
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
    proposalLength: proposalLength || preimageStatus.proposalLength,
    proposalWarning,
    registry: api.registry
  });
}

function convertDeposit (deposit?: [AccountId, Balance] | null): PreimageDeposit | undefined {
  return deposit
    ? {
      amount: deposit[1],
      who: deposit[0].toString()
    }
    : undefined;
}

function createStatus (api: ApiPromise, hash: HexString | Hash, status: PalletPreimageRequestStatus | null = null): PreimageStatus {
  return {
    count: 0,
    isCompleted: false,
    proposalHash: isString(hash)
      ? hash
      : hash.toHex(),
    registry: api.registry,
    status
  };
}

function getBytesParams (api: ApiPromise, [[proposalHash], optStatus]: [[HexString], Option<PalletPreimageRequestStatus>]): InterimResult {
  const isHashParam = getParamType(api) === 'hash';
  const status = optStatus.unwrapOr(null);
  const preimageStatus = createStatus(api, proposalHash, status);

  if (status) {
    if (status.isRequested) {
      const asRequested = status.asRequested;

      if (asRequested instanceof Option) {
        // FIXME Cannot recall how to deal with these
        // (unlike Unrequested below, didn't have an example)
      } else {
        const { count, deposit, len } = asRequested;

        preimageStatus.count = count.toNumber();
        preimageStatus.deposit = convertDeposit(deposit.unwrapOr(null));
        preimageStatus.proposalLength = len.unwrapOr(BN_ZERO);
      }
    } else if (status.isUnrequested) {
      const asUnrequested = status.asUnrequested;

      if (asUnrequested instanceof Option) {
        preimageStatus.deposit = convertDeposit(
          // old-style conversion
          (asUnrequested as Option<ITuple<[AccountId, Balance]>>).unwrapOr(null)
        );
      } else {
        const { deposit, len } = status.asUnrequested;

        preimageStatus.deposit = convertDeposit(deposit);
        preimageStatus.proposalLength = len;
      }
    } else {
      // for future reference...
      console.error('Unhandled preimage status type: ', status.type);
    }
  }

  return {
    paramsBytes: isHashParam
      ? [preimageStatus.proposalHash]
      : [[preimageStatus.proposalHash, preimageStatus.proposalLength || BN_ZERO]],
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

function getStatusParam (hashOrBounded?: Hash | HexString | FrameSupportPreimagesBounded | null): [HexString] | undefined {
  const hash = hashOrBounded && getPreimageHash(hashOrBounded);

  return hash && hash.length === 66
    ? [hash]
    : undefined;
}

function usePreimageImpl (hashOrBounded?: Hash | HexString | FrameSupportPreimagesBounded | null): Preimage | undefined {
  const { api } = useApi();

  // retrieve the status using only the hash of the image
  const paramsStatus = useMemo(
    () => getStatusParam(hashOrBounded),
    [hashOrBounded]
  );

  const optStatus = useCall<[[HexString], Option<PalletPreimageRequestStatus>]>(paramsStatus && api.query.preimage?.statusFor, paramsStatus, OPT_STATUS);

  // from the retrieved status (if any), get the on-chain stored bytes
  const { paramsBytes, preimageStatus } = useMemo(
    () => optStatus
      ? getBytesParams(api, optStatus)
      : paramsStatus
        ? { preimageStatus: createStatus(api, paramsStatus[0]) }
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
