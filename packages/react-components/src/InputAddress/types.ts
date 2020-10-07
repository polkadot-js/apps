// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeyringSectionOption, KeyringOption$Type } from '@polkadot/ui-keyring/options/types';
import { BareProps } from '../types';

import React from 'react';

export interface InputAddressProps extends BareProps {
  defaultValue?: Uint8Array | string | null;
  help?: React.ReactNode;
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

export interface Option extends KeyringSectionOption {
  className?: string;
  text: React.ReactNode;
}
