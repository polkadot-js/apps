// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MethodFunction } from '@polkadot/types/primitive/Method';
import { RawParamOnChange, RawParamOnEnter } from '@polkadot/ui-params/types';
import { BareProps } from '../types';

import React from 'react';
import { Method } from '@polkadot/types';

import BaseExtrinsic from '../Extrinsic';

type Props = BareProps & {
  defaultValue: MethodFunction,
  isDisabled?: boolean,
  isError?: boolean,
  isPrivate: boolean,
  label: React.ReactNode,
  onChange?: RawParamOnChange,
  onEnter?: RawParamOnEnter,
  withLabel?: boolean
};

export default class ExtrinsicDisplay extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, defaultValue, isDisabled, isError, isPrivate, label, onEnter, style, withLabel } = this.props;

    return (
      <BaseExtrinsic
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        isPrivate={isPrivate}
        label={label}
        onChange={this.onChange}
        onEnter={onEnter}
        style={style}
        withLabel={withLabel}
      />
    );
  }

  onChange = (method: Method): void => {
    const { onChange } = this.props;

    onChange && onChange({
      isValid: !!method,
      value: method
    });
  }
}
