// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import cord from './cord';



// NOTE: The mapping is done from specName in state.getRuntimeVersion
const spec: Record<string, OverrideBundleDefinition> = {
  'cord-dev': cord,
  'cord-local': cord,
  'cord-staging': cord,
  'cord': cord,
  'cord-node': cord,

};

export default spec;
