// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface DropdownOption {
  className?: string;
  key?: string;
  text: React.ReactNode;
  value: string;
}

export type DropdownOptions = DropdownOption[];
