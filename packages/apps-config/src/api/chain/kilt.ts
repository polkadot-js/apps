// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { typesBundle } from '@kiltprotocol/type-definitions';

export default typesBundle.chain as Record<string, OverrideBundleDefinition>;
