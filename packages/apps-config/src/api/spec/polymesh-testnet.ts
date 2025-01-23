// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { typesBundle } from '@polymeshassociation/polymesh-types';

const definitions: OverrideBundleDefinition = typesBundle.spec.polymesh_testnet as OverrideBundleDefinition;

export default definitions;
