// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Bytes } from '@polkadot/types';
import type { AccountId, Balance, Hash } from '@polkadot/types/interfaces';
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
  interimStatus?: PreimageStatus;
  paramsBytes?: BytesParams;
}

type Result = 'unknown' | 'hash' | 'hashAndLen';

const OPT_PARAMS = { withParamsTransform: true };

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

function convertDeposit (deposit?: [AccountId, Balance] | null): PreimageDeposit | undefined {
  return deposit
    ? {
      amount: deposit[1],
      who: deposit[0].toString()
    }
    : undefined;
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

function getParamsStatus (api: ApiPromise, hashOrBounded?: Hash | HexString | FrameSupportPreimagesBounded | null): { initialStatus?: PreimageStatus, paramsStatus?: [HexString] } {
  if (!hashOrBounded) {
    return {};
  }

  const proposalHash = getPreimageHash(hashOrBounded);

  return {
    initialStatus: {
      isCompleted: false,
      isHashParam: getParamType(api) === 'hash',
      proposalHash,
      registry: api.registry,
      status: null
    },
    paramsStatus: [proposalHash]
  };
}

function getParamsBytes (initialStatus?: PreimageStatus, optStatus?: [[HexString], Option<PalletPreimageRequestStatus>]): InterimResult {
  if (!initialStatus || !optStatus || initialStatus.proposalHash !== optStatus[0][0]) {
    return { interimStatus: initialStatus };
  }

  const status = optStatus[1].unwrapOr(null);
  const interimStatus = objectSpread<PreimageStatus>({}, initialStatus, { status });

  if (status) {
    if (status.isRequested) {
      const asRequested = status.asRequested;

      if (asRequested instanceof Option) {
        // FIXME Cannot recall how to deal with these
        // (unlike Unrequested below, didn't have an example)
      } else {
        const { count, deposit, len } = asRequested;

        interimStatus.count = count.toNumber();
        interimStatus.deposit = convertDeposit(deposit.unwrapOr(null));
        interimStatus.proposalLength = len.unwrapOr(BN_ZERO);
      }
    } else if (status.isUnrequested) {
      const asUnrequested = status.asUnrequested;

      if (asUnrequested instanceof Option) {
        interimStatus.deposit = convertDeposit(
          // old-style conversion
          (asUnrequested as Option<ITuple<[AccountId, Balance]>>).unwrapOr(null)
        );
      } else {
        const { deposit, len } = status.asUnrequested;

        interimStatus.deposit = convertDeposit(deposit);
        interimStatus.proposalLength = len;
      }
    } else {
      // for future reference...
      console.error('Unhandled preimage status type: ', status.type);
    }
  }

  return {
    interimStatus,
    paramsBytes: interimStatus.isHashParam
      ? [interimStatus.proposalHash]
      : [[interimStatus.proposalHash, interimStatus.proposalLength || BN_ZERO]]
  };
}

function getResult (interimStatus?: PreimageStatus, optBytes?: [BytesParams, Option<Bytes>]): Preimage | undefined {
  const bytesHash = optBytes
    ? Array.isArray(optBytes[0][0])
      ? optBytes[0][0][0]
      : optBytes[0][0]
    : undefined;

  if (!interimStatus || !optBytes || interimStatus.proposalHash !== bytesHash) {
    return interimStatus;
  }

  const bytes = optBytes[1].unwrapOr(null);
  const preimageStatus = objectSpread<Preimage>({}, interimStatus, { bytes, isCompleted: true });

  if (bytes) {
    try {
      preimageStatus.proposal = preimageStatus.registry.createType('Call', bytes.toU8a(true));

      const callLength = preimageStatus.proposal.encodedLength;

      if (preimageStatus.proposalLength) {
        const storeLength = preimageStatus.proposalLength.toNumber();

        if (callLength !== storeLength) {
          preimageStatus.proposalWarning = `Decoded call length does not match on-chain stored preimage length (${formatNumber(callLength)} bytes vs ${formatNumber(storeLength)} bytes)`;
        }
      } else {
        // for the old style, we set the actual length
        preimageStatus.proposalLength = new BN(callLength);
      }
    } catch (error) {
      console.error(error);

      preimageStatus.proposalError = 'Unable to decode preimage bytes into a valid Call';
    }
  } else {
    preimageStatus.proposalWarning = 'No preimage bytes found';
  }

  return preimageStatus;
}

function usePreimageImpl (hashOrBounded?: Hash | HexString | FrameSupportPreimagesBounded | null): Preimage | undefined {
  const { api } = useApi();

  // retrieve the status using only the hash of the image
  const { initialStatus, paramsStatus } = useMemo(
    // we need a hash _and_ be on the newest supported version of the pallet
    // (after the application of bounded calls)
    () => getParamsStatus(api, hashOrBounded),
    [api, hashOrBounded]
  );

  const optStatus = useCall<[[HexString], Option<PalletPreimageRequestStatus>]>(paramsStatus && api.query.preimage?.statusFor, paramsStatus, OPT_PARAMS);

  // from the retrieved status (if any), get the on-chain stored bytes
  const { interimStatus, paramsBytes } = useMemo(
    () => getParamsBytes(initialStatus, optStatus),
    [initialStatus, optStatus]
  );

  const optBytes = useCall<[[HexString], Option<Bytes>]>(paramsBytes && api.query.preimage?.preimageFor, paramsBytes, OPT_PARAMS);

  // extract all the preimage info we have retrieved
  return useMemo(
    () => getResult(interimStatus, optBytes),
    [interimStatus, optBytes]
  );
}

export const usePreimage = createNamedHook('usePreimage', usePreimageImpl);
