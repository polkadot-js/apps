// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { typesBundleForPolkadot } from '@pendulum-chain/type-definitions';

export default (typesBundleForPolkadot as { spec: { pendulum: OverrideBundleDefinition } }).spec.pendulum;
