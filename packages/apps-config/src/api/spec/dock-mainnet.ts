// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// @ts-expect-error No definitions provided in package
import { spec } from '@docknetwork/node-types';

export default (spec as { 'dock-main-runtime': OverrideBundleDefinition })['dock-main-runtime'];
