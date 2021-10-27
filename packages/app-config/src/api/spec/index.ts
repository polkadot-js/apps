// Copyright 2017-2021 @polkadot/app-config authors & contributors
// and @canvas-ui/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import type { OverrideBundleDefinition } from '@polkadot/types/types';

import canvas from './canvas';
import substrateContractsNode from './substrateContractsNode';

export const spec: Record<string, OverrideBundleDefinition> = { canvas, 'substrate-contracts-node': substrateContractsNode };
