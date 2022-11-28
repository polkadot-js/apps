// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { applyDerives } from './derives';
import { typesBundle as typesOnlyBundle } from './typesBundle';

export * from './constants';
export * from './params';

export const typesBundle = applyDerives(typesOnlyBundle);
