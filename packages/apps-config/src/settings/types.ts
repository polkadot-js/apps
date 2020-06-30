// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export interface Option {
  info?: string;
  isDisabled?: boolean;
  isHeader?: boolean;
  text: React.ReactNode;
  value: string | number;
}
