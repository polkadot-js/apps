// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export interface ColBalanceProps {
  className?: string;
  value?: BN | null;
  withLoading?: boolean;
}

export interface ColExpandProps {
  className?: string;
  isExpanded: boolean;
  toggle: () => void;
}

export interface ColFavoriteProps {
  address: string;
  className?: string;
  isFavorite: boolean;
  toggle: (address: string) => void;
}

export interface ColIdProps {
  className?: string;
  value: BN | number;
}

export interface TableProps {
  children?: React.ReactNode;
  className?: string;
  empty?: React.ReactNode | false;
  emptySpinner?: React.ReactNode;
  filter?: React.ReactNode;
  footer?: React.ReactNode;
  header?: ([React.ReactNode?, string?, number?, (() => void)?] | false | null | undefined)[];
  headerChildren?: React.ReactNode;
  isFixed?: boolean;
  isInline?: boolean;
  isSplit?: boolean;
  legend?: React.ReactNode;
  noBodyTag?: boolean;
}

export type TableType = React.ComponentType<TableProps> & {
  Column: {
    Balance: React.ComponentType<ColBalanceProps>;
    Expand: React.ComponentType<ColExpandProps>;
    Favorite: React.ComponentType<ColFavoriteProps>;
    Id: React.ComponentType<ColIdProps>;
  }
};
