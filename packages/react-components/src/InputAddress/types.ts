// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { KeyringOption$Type, KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

export interface Option extends KeyringSectionOption {
  className?: string;
  text: React.ReactNode;
}

export interface InputAddressProps {
  className?: string;
  defaultValue?: Uint8Array | string | null;
  hideAddress?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  isInput?: boolean;
  isMultiple?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  onChange?: (value: string | null) => void;
  onChangeMulti?: (value: string[]) => void;
  options?: KeyringSectionOption[];
  optionsAll?: Record<string, Option[]>;
  placeholder?: string;
  type?: KeyringOption$Type;
  value?: string | Uint8Array | string[] | null;
  withEllipsis?: boolean;
  withLabel?: boolean;
}
