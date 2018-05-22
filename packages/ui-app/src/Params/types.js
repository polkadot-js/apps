// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Type, Param$Types, Param$Value } from '@polkadot/params/types';
import type { BareProps } from '../types';

export type RawParam = {
  isValid: boolean,
  value: Param$Value,
}

export type RawParam$OnChange = (value: RawParam) => void;

export type RawParams = Array<RawParam>;

export type BaseProps = BareProps & {
  name: string,
  onChange: RawParam$OnChange,
  type: Param$Types
};

export type Props = BaseProps & {
  isDisabled?: boolean,
  isError?: boolean,
  label: string,
  withLabel?: boolean
};

export type ComponentProps$Extra = {
  [string]: mixed
}

export type ComponentProps = Props & ComponentProps$Extra;

export type Size = 'full' | 'large' | 'medium' | 'small';

export type ComponentMap = {
  [Param$Type]: React$ComponentType<ComponentProps>
};
