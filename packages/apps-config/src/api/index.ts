// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleType } from '@polkadot/types/types';

import spec from './spec';

export * from './constants';
export * from './params';

export const typesBundle: OverrideBundleType = { spec };
