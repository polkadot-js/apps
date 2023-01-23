// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Balance from './Balance';
import Expand from './Expand';
import Favorite from './Favorite';
import Id from './Id';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

function ColumnBase ({ children, className = '' }: Props): React.ReactElement<Props> {
  return (
    <td className={`${className} ui--Table-Column`}>
      {children}
    </td>
  );
}

const Column = React.memo(ColumnBase) as unknown as typeof ColumnBase & {
  Balance: typeof Balance,
  Expand: typeof Expand,
  Favorite: typeof Favorite,
  Id: typeof Id
};

Column.Balance = Balance;
Column.Expand = Expand;
Column.Favorite = Favorite;
Column.Id = Id;

export default Column;
