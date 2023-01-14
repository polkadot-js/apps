// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import spec from './spec';
import { typesBundle } from '.';

function getDerives (spec: Record<string, OverrideBundleDefinition>): string[] {
  return Object
    .entries(spec)
    .filter(([, v]) => !!v.derives)
    .map(([k]) => k);
}

describe('typesBundle', (): void => {
  it('all derives are re-exported', (): void => {
    expect(
      getDerives(spec)
    ).toEqual(
      getDerives(typesBundle.spec || {})
    );
  });
});
