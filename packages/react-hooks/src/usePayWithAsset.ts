// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PayWithAsset } from './ctx/types.js';

import { useContext } from 'react';

import { PayWithAssetCtx } from './ctx/PayWithAsset.js';
import { createNamedHook } from './createNamedHook.js';

function usePayWithAssetImpl (): PayWithAsset {
  return useContext(PayWithAssetCtx);
}

export const usePayWithAsset = createNamedHook('usePayWithAsset', usePayWithAssetImpl);
