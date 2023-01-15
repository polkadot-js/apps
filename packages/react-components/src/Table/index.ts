// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TableType } from './types';

import { Column } from './Column';
import TableBase from './Table';

const Table = TableBase as unknown as TableType;

Table.Column = Column;

export default Table;
