// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockAuthors } from './ctx/types';

import { useContext } from 'react';

import { BlockAuthorsCtx } from './ctx/BlockAuthors';
import { createNamedHook } from './createNamedHook';

function useBlockAuthorsImpl (): BlockAuthors {
  return useContext(BlockAuthorsCtx);
}

export const useBlockAuthors = createNamedHook('useBlockAuthors', useBlockAuthorsImpl);
