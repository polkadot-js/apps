// Copyright 2017-2021 @polkadot/app-config authors & contributors
// and @canvas-ui/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import type { OverrideBundleType } from '@polkadot/types/types';

// import Berlin from './berlin';
import { spec } from '../spec';
import Arcadia from './arcadia';

export const typesChain = {
  'Arcadia Nodle Network': Arcadia
  // Berlin
};
export const typesBundle: OverrideBundleType = { spec };
