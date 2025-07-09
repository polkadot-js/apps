// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { applyDerives } from './derives.js';
import { typesBundle as typesOnlyBundle } from './typesBundle.js';

export * from './constants.js';
export * from './params/index.js';

export const typesBundle = /*#__PURE__*/ applyDerives(typesOnlyBundle);
