// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ColExpandProps, ColFavoriteProps, ColIdProps, TableProps } from './types';

import React from 'react';

import Expand from './Column/Expand';
import Favorite from './Column/Favorite';
import Id from './Column/Id';
import TableBase from './Table';

type TableType = React.ComponentType<TableProps> & {
  Column: {
    Expand: React.ComponentType<ColExpandProps>;
    Favorite: React.ComponentType<ColFavoriteProps>;
    Id: React.ComponentType<ColIdProps>;
  }
};

const Table = TableBase as unknown as TableType;

Table.Column = { Expand, Favorite, Id };

export default Table;
