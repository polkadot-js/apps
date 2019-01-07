// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export type DropdownOption = {
  className?: string,
  key?: string,
  text: React.ReactNode,
  value: string
};

export type DropdownOptions = Array<DropdownOption>;
