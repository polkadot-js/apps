// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Param$Type, Param$Types, Param$Value } from '@polkadot/params/types';
import { BareProps } from '../types';

export type RawParam$Value = Param$Value | undefined;

export type RawParam$ValueArray = Array<Param$Value | undefined | Array<Param$Value | undefined>>;

export type RawParam$Values = RawParam$Value | RawParam$ValueArray;

export type RawParam = {
  isValid: boolean,
  type: Param$Types,
  value: RawParam$Values,
}

export type RawParam$OnChange = (value: { isValid: boolean, value: RawParam$Values }) => void;

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
  [index: string]: React.ComponentType<Props> // Param$Type
};
