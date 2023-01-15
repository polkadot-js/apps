// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TableType } from '../types';

import Balance from './Balance';
import Expand from './Expand';
import Favorite from './Favorite';
import Id from './Id';

export const Column: TableType['Column'] = { Balance, Expand, Favorite, Id };
