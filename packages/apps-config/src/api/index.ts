// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { applyDerives } from './derives.js';
import { typesBundle as typesOnlyBundle } from './typesBundle.js';

export * from './params/index.js';
export * from './constants.js';

export const typesBundle = applyDerives(typesOnlyBundle);
