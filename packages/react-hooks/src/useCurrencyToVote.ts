// Copyright 2017-2026 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { BN, BN_ONE } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

// u64::MAX = 2^64 - 1 = 18,446,744,073,709,551,615
const U64_MAX = new BN('18446744073709551615');

interface CurrencyToVote {
  // The factor to convert from currency to vote
  factor: BN;
  // Convert a currency balance to voting power
  toVote: (balance: BN) => BN;
  // Convert voting power back to currency balance
  toCurrency: (vote: BN) => BN;
}

/**
 * Calculate the CurrencyToVote factor based on total issuance.
 *
 * - If total_issuance < 2^64, then factor = 1 (no conversion needed)
 * - If total_issuance >= 2^64, then factor = (total_issuance / 2^64).max(1)
 *
 * The conversion formulas is:
 * - vote = balance / factor
 */
function calculateFactor (totalIssuance: BN): BN {
  if (totalIssuance.lte(U64_MAX)) {
    return BN_ONE;
  }

  const factor = totalIssuance.div(U64_MAX);

  return factor.isZero() ? BN_ONE : factor;
}

function useCurrencyToVoteImpl (): CurrencyToVote {
  const { api } = useApi();
  const totalIssuance = useCall<BN>(api.query.balances?.totalIssuance);

  return useMemo((): CurrencyToVote => {
    const factor = totalIssuance ? calculateFactor(totalIssuance) : BN_ONE;

    return {
      factor,
      toCurrency: (vote: BN) => vote.mul(factor),
      toVote: (balance: BN) => balance.div(factor)
    };
  }, [totalIssuance]);
}

export const useCurrencyToVote = createNamedHook('useCurrencyToVote', useCurrencyToVoteImpl);
