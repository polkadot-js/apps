// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { typesBundleForPolkadot } from '@bifrost-finance/type-definitions';

export default (typesBundleForPolkadot as { spec: { bifrost: OverrideBundleDefinition } }).spec.bifrost;
