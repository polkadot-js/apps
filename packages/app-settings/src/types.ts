// Copyright 2017-2019 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export interface Option {
  text: React.ReactNode;
  value: string | number;
}

export interface SetOption {
  info: string;
  text: string;
  value: string | number;
}
