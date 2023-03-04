// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { typesBundle } from '@cord.network/type-definitions';

export default typesBundle.chain as Record<string, OverrideBundleDefinition>;

