// Copyright 2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the APL2 license. See the LICENSE file for details.

export type BaseProps = {
  className?: string,
  style?: {
    [index: string]: any
  }
};

export type Props = BaseProps & {
  size: number,
  value: string
};
