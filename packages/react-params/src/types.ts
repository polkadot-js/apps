// Copyright 2017-2020 @polkadot/react-params authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';

// FIXME Ideally, we want these as Base from api-codec - as a stop-gap, any this until we have
// params returning types extending Base (i.e. anything from api-codec)
export type RawParamValue = unknown | undefined;

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
export type RawParamOnEscape = () => void;

export type RawParams = RawParam[];

export interface Props {
  className?: string;
  defaultValue: RawParam;
  isDisabled?: boolean;
  isError?: boolean;
  isInOption?: boolean;
  isReadOnly?: boolean;
  isOptional?: boolean;
  label?: React.ReactNode;
  name?: string;
  onChange?: RawParamOnChange;
  onEnter?: RawParamOnEnter;
  onEscape?: RawParamOnEscape;
  overrides?: ComponentMap;
  type: TypeDef & { withOptionActive?: boolean };
  withLabel?: boolean;
}

export type Size = 'full' | 'large' | 'medium' | 'small';

export type ComponentMap = Record<string, React.ComponentType<Props>>;

export interface ParamDef {
  length?: number;
  name?: string;
  type: TypeDef;
}
