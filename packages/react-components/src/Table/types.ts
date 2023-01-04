// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
