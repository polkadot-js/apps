// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockAuthors } from './ctx/types.js';

import { useContext } from 'react';

import { BlockAuthorsCtx } from './ctx/BlockAuthors.js';
import { createNamedHook } from './createNamedHook.js';

function useBlockAuthorsImpl (): BlockAuthors {
  return useContext(BlockAuthorsCtx);
}

export const useBlockAuthors = createNamedHook('useBlockAuthors', useBlockAuthorsImpl);
