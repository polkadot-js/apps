// Copyright 2017-2020 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { RawParamOnChange, RawParamOnEnter, RawParamOnEscape } from '@polkadot/react-params/types';
import { BareProps } from '../types';

import React from 'react';

import BaseExtrinsic from '../Extrinsic';

interface Props extends BareProps {
  defaultValue: SubmittableExtrinsicFunction<'promise'>;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate: boolean;
  label: React.ReactNode;
  onChange?: RawParamOnChange;
  onEnter?: RawParamOnEnter;
  onEscape?: RawParamOnEscape;
  withLabel?: boolean;
}

function onChange ({ onChange }: Props): (method?: SubmittableExtrinsic<'promise'>) => void {
  return (method?: SubmittableExtrinsic<'promise'>): void => {
    onChange && onChange({
      isValid: !!method,
      value: method
    });
  };
}

export default function ExtrinsicDisplay (props: Props): React.ReactElement<Props> {
  const { className, defaultValue, isDisabled, isError, isPrivate, label, onEnter, onEscape, style, withLabel } = props;

  return (
    <BaseExtrinsic
      className={className}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      isPrivate={isPrivate}
      label={label}
      onChange={onChange(props)}
      onEnter={onEnter}
      onEscape={onEscape}
      style={style}
      withLabel={withLabel}
    />
  );
}
