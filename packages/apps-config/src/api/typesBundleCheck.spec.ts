// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import spec from './spec/index.js';
import { typesBundle } from './index.js';

function getDerives (spec: Record<string, OverrideBundleDefinition>): string[] {
  return Object
    .entries(spec)
    .filter(([, v]) => !!v.derives)
    .map(([k]) => k);
}

describe('typesBundle checks', (): void => {
  it('all derives are re-exported', (): void => {
    expect(
      getDerives(spec)
    ).toEqual(
      getDerives(typesBundle.spec || {})
    );
  });
});
