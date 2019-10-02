// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { BareProps } from '@polkadot/react-components/types';

// FIXME Ideally, we want these as Base from api-codec - as a stop-gap, any this until we have
// params returning types extending Base (i.e. anything from api-codec)
export type RawParamValue = any | undefined;

export type RawParamValueArray = (RawParamValue | RawParamValue[])[];

export type RawParamValues = RawParamValue | RawParamValueArray;

export interface RawParam {
  isValid: boolean;
  value: RawParamValues;
}

export interface RawParamOnChangeValue {
  isValid: boolean;
  value: RawParamValues;
}
export type RawParamOnChange = (value: RawParamOnChangeValue) => void;
export type RawParamOnEnter = () => void;

export type RawParams = RawParam[];

export interface BaseProps extends BareProps {
  defaultValue: RawParam;
  name?: string;
  onChange?: RawParamOnChange;
  onEnter?: RawParamOnEnter;
  type: TypeDef;
}

export interface Props extends BaseProps {
  isDisabled?: boolean;
  isError?: boolean;
  isReadOnly?: boolean;
  label?: React.ReactNode;
  withLabel?: boolean;
}

export type Size = 'full' | 'large' | 'medium' | 'small';

export type ComponentMap = Record<string, React.ComponentType<Props>>;

export interface ParamDef {
  name?: string;
  type: TypeDef;
}
