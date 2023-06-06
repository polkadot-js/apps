// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import types from '@docknetwork/node-types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const definitions = (types as { spec: { 'dock-test-runtime': OverrideBundleDefinition } }).spec['dock-test-runtime'];

export default definitions;
