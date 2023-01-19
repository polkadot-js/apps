// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
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
import { BN, BN_ZERO, formatNumber, isString, isU8a, objectSpread, u8aToHex } from '@polkadot/util';

type BytesParamsType = [[proposalHash: HexString, proposalLength: BN]] | [proposalHash: HexString];

interface BytesParams {
  paramsBytes?: BytesParamsType;
  resultPreimageFor?: PreimageStatus;
}

interface StatusParams {
  inlineData?: Uint8Array;
  paramsStatus?: [HexString];
  proposalHash?: HexString;
  resultPreimageHash?: PreimageStatus;
}

type Result = 'unknown' | 'hash' | 'hashAndLen';

/**
 * @internal Determine if we are working with current generation (H256,u32)
 * or previous generation H256 params to the preimageFor storage entry
 */
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

/** @internal Unwraps a passed preimage hash into components */
export function getPreimageHash (api: ApiPromise, hashOrBounded: Hash | HexString | FrameSupportPreimagesBounded): StatusParams {
  let proposalHash: HexString | undefined;
  let inlineData: Uint8Array | undefined;

  if (isString(hashOrBounded)) {
    proposalHash = hashOrBounded;
  } else if (isU8a(hashOrBounded)) {
    proposalHash = hashOrBounded.toHex();
  } else {
    const bounded = hashOrBounded;

    if (bounded.isInline) {
      inlineData = bounded.asInline.toU8a(true);
      proposalHash = u8aToHex(api.registry.hash(inlineData));
    } else if (hashOrBounded.isLegacy) {
      proposalHash = hashOrBounded.asLegacy.hash_.toHex();
    } else if (hashOrBounded.isLookup) {
      proposalHash = hashOrBounded.asLookup.hash_.toHex();
    } else {
      console.error(`Unhandled FrameSupportPreimagesBounded type ${hashOrBounded.type}`);
    }
  }

  return {
    inlineData,
    paramsStatus: proposalHash && [proposalHash],
    proposalHash,
    resultPreimageHash: proposalHash && {
      count: 0,
      isCompleted: false,
      isHashParam: getParamType(api) === 'hash',
      proposalHash,
      proposalLength: inlineData && new BN(inlineData.length),
      registry: api.registry,
      status: null
    }
  };
}

/** @internal Creates a final result */
function createResult (interimResult: PreimageStatus, optBytes: Option<Bytes> | Uint8Array): Preimage {
  const callData = isU8a(optBytes)
    ? optBytes
    : optBytes.unwrapOr(null);
  let proposal: Call | null = null;
  let proposalError: string | null = null;
  let proposalWarning: string | null = null;
  let proposalLength: BN | undefined;

  if (callData) {
    try {
      proposal = interimResult.registry.createType('Call', callData);

      const callLength = proposal.encodedLength;

      if (interimResult.proposalLength) {
        const storeLength = interimResult.proposalLength.toNumber();

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

  return objectSpread<Preimage>({}, interimResult, {
    isCompleted: true,
    proposal,
    proposalError,
    proposalLength: proposalLength || interimResult.proposalLength,
    proposalWarning
  });
}

/** @internal Helper to unwrap a deposit tuple into a structure */
function convertDeposit (deposit?: [AccountId, Balance] | null): PreimageDeposit | undefined {
  return deposit
    ? {
      amount: deposit[1],
      who: deposit[0].toString()
    }
    : undefined;
}

/** @internal Returns the parameters required for a call to bytes */
function getBytesParams (interimResult: PreimageStatus, optStatus: Option<PalletPreimageRequestStatus>): BytesParams {
  const result = objectSpread<PreimageStatus>({}, interimResult, {
    status: optStatus.unwrapOr(null)
  });

  if (result.status) {
    if (result.status.isRequested) {
      const asRequested = result.status.asRequested;

      if (asRequested instanceof Option) {
        // FIXME Cannot recall how to deal with these
        // (unlike Unrequested below, didn't have an example)
      } else {
        const { count, deposit, len } = asRequested;

        result.count = count.toNumber();
        result.deposit = convertDeposit(deposit.unwrapOr(null));
        result.proposalLength = len.unwrapOr(BN_ZERO);
      }
    } else if (result.status.isUnrequested) {
      const asUnrequested = result.status.asUnrequested;

      if (asUnrequested instanceof Option) {
        result.deposit = convertDeposit(
          // old-style conversion
          (asUnrequested as Option<ITuple<[AccountId, Balance]>>).unwrapOr(null)
        );
      } else {
        const { deposit, len } = result.status.asUnrequested;

        result.deposit = convertDeposit(deposit);
        result.proposalLength = len;
      }
    } else {
      console.error(`Unhandled PalletPreimageRequestStatus type: ${result.status.type}`);
    }
  }

  return {
    paramsBytes: result.isHashParam
      ? [result.proposalHash]
      : [[result.proposalHash, result.proposalLength || BN_ZERO]],
    resultPreimageFor: result
  };
}

function usePreimageImpl (hashOrBounded?: Hash | HexString | FrameSupportPreimagesBounded | null): Preimage | undefined {
  const { api } = useApi();

  // retrieve the status using only the hash of the image
  const { inlineData, paramsStatus, resultPreimageHash } = useMemo(
    () => hashOrBounded
      ? getPreimageHash(api, hashOrBounded)
      : {},
    [api, hashOrBounded]
  );

  const optStatus = useCall<Option<PalletPreimageRequestStatus>>(paramsStatus && api.query.preimage?.statusFor, paramsStatus);

  // from the retrieved status (if any), get the on-chain stored bytes
  const { paramsBytes, resultPreimageFor } = useMemo(
    () => resultPreimageHash && optStatus
      ? getBytesParams(resultPreimageHash, optStatus)
      : {},
    [optStatus, resultPreimageHash]
  );

  const optBytes = useCall<Option<Bytes>>(paramsBytes && api.query.preimage?.preimageFor, paramsBytes);

  // extract all the preimage info we have retrieved
  return useMemo(
    () => resultPreimageFor
      ? optBytes
        ? createResult(resultPreimageFor, optBytes)
        : resultPreimageFor
      : resultPreimageHash
        ? inlineData
          ? createResult(resultPreimageHash, inlineData)
          : resultPreimageHash
        : undefined,
    [inlineData, optBytes, resultPreimageHash, resultPreimageFor]
  );
}

export const usePreimage = createNamedHook('usePreimage', usePreimageImpl);
