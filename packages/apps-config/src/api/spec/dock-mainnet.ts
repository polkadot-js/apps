// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const types: any = require('@docknetwork/node-types');

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const definitions = types.spec['dock-main-runtime'] as OverrideBundleDefinition;

export default definitions;
