// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Type, Param$Types, Param$Value } from '@polkadot/params/types';
import type { BareProps } from '../types';

export type RawParam$Value = ?Param$Value;

export type RawParam$ValueArray = Array<?Param$Value | RawParam$ValueArray>;

export type RawParam$Values = RawParam$Value | RawParam$ValueArray;

export type RawParam = {
  isValid: boolean,
  type: Param$Types,
  value: RawParam$Values,
}

export type RawParam$OnChange = (value: $Shape<RawParam>) => void;

export type RawParams = Array<RawParam>;

export type BaseProps = BareProps & {
  defaultValue: RawParam,
  name: string,
  onChange: RawParam$OnChange
};

export type Props = BaseProps & {
  isDisabled?: boolean,
  isError?: boolean,
  label: string,
  withLabel?: boolean
};

export type Size = 'full' | 'large' | 'medium' | 'small';

export type ComponentMap = {
  [Param$Type]: React$ComponentType<Props>
};
