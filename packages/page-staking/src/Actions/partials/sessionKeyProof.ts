// Copyright 2017-2026 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

export interface OwnershipProof {
  keys: string;
  proof: string;
  stashId: string;
}

// Both old and new SDKs expose two setKeys arguments. Quip explicitly requires
// ownership proofs; keep the existing empty-proof flow for other chains.
export function requiresOwnershipProof (api: ApiPromise): boolean {
  return api.runtimeVersion.specName.toString() === 'quip';
}

export function isNonEmptyHex (value: string | null | undefined): value is string {
  return !!value && /^0x(?:[0-9a-fA-F]{2})+$/.test(value);
}

export function validOwnershipProof (proof: OwnershipProof | null, stashId: string, keys: string | null): boolean {
  return !!proof && proof.stashId === stashId && proof.keys === keys && isNonEmptyHex(proof.proof);
}
