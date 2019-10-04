// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call } from '@polkadot/types/interfaces';
import { CallFunction } from '@polkadot/types/types';
import { RawParamOnChange, RawParamOnEnter } from '@polkadot/react-params/types';
import { BareProps } from '../types';

import React from 'react';

import BaseExtrinsic from '../Extrinsic';

interface Props extends BareProps {
  defaultValue: CallFunction;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate: boolean;
  label: React.ReactNode;
  onChange?: RawParamOnChange;
  onEnter?: RawParamOnEnter;
  withLabel?: boolean;
}

function onChange ({ onChange }: Props): (method?: Call) => void {
  return (method?: Call): void => {
    onChange && onChange({
      isValid: !!method,
      value: method
    });
  };
}

export default function ExtrinsicDisplay (props: Props): React.ReactElement<Props> {
  const { className, defaultValue, isDisabled, isError, isPrivate, label, onEnter, style, withLabel } = props;

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
      style={style}
      withLabel={withLabel}
    />
  );
}
