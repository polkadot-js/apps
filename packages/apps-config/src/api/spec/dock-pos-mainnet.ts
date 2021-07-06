// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

const types: any = require('@docknetwork/node-types')

const definitions = types.spec['dock-pos-main-runtime'] as OverrideBundleDefinition;

export default definitions;
