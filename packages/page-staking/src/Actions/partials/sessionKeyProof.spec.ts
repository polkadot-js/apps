// Copyright 2017-2026 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import type { ApiPromise } from '@polkadot/api';

import { isNonEmptyHex, requiresOwnershipProof, validOwnershipProof } from './sessionKeyProof.js';

describe('session key ownership proof', () => {
  it('detects Quip explicitly, preserving the legacy flow on other chains', () => {
    const api = (specName: string) => ({ runtimeVersion: { specName } }) as unknown as ApiPromise;

    expect(requiresOwnershipProof(api('quip'))).toEqual(true);
    expect(requiresOwnershipProof(api('polkadot'))).toEqual(false);
  });

  it('rejects empty, malformed and partial-byte hex', () => {
    for (const value of [null, '', '0x', '1234', '0x1', '0xgg', '0x123']) {
      expect(isNonEmptyHex(value)).toEqual(false);
    }

    expect(isNonEmptyHex('0x1234AB')).toEqual(true);
  });

  it('binds proof validity to both stash and keys', () => {
    const proof = { keys: '0x1234', proof: '0xabcd', stashId: 'stash-a' };

    expect(validOwnershipProof(proof, 'stash-a', '0x1234')).toEqual(true);
    expect(validOwnershipProof(proof, 'stash-b', '0x1234')).toEqual(false);
    expect(validOwnershipProof(proof, 'stash-a', '0x5678')).toEqual(false);
    expect(validOwnershipProof(null, 'stash-a', '0x1234')).toEqual(false);
    expect(validOwnershipProof({ ...proof, proof: '0x' }, 'stash-a', '0x1234')).toEqual(false);
  });
});
