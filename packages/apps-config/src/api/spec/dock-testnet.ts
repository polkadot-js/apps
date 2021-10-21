// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { spec } from '@docknetwork/node-types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const definitions = spec['dock-pos-test-runtime'] as OverrideBundleDefinition;

export default definitions;
