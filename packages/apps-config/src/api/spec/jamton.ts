// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { rpc, runtime, signedExtensions, types } from '@jamton/parachain-ts-interfaces/bundle';

/* eslint-disable sort-keys */
const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types
    }
  ],
  runtime,
  rpc,
  signedExtensions
};

export default definitions;
