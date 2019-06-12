// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MethodFunction } from '@polkadot/types/primitive/Method';
import { I18nProps } from '@polkadot/ui-app/types';
import { RawParam$OnChange, RawParam$OnEnter } from '@polkadot/ui-params/types';

import React from 'react';
import { Method } from '@polkadot/types';

import BaseExtrinsic from '../Extrinsic';
import translate from '../translate';

type Props = I18nProps & {
  defaultValue: MethodFunction,
  isDisabled?: boolean,
  isError?: boolean,
  isPrivate: boolean,
  label: React.ReactNode,
  onChange?: RawParam$OnChange,
  onEnter?: RawParam$OnEnter,
  withLabel?: boolean
};

class ExtrinsicDisplay extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isDisabled, isError, isPrivate, label, onEnter, style, t, withLabel } = this.props;

    return (
      <BaseExtrinsic
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        isPrivate={isPrivate}
        label={t('{{label}} (extrinsic)', {
          replace: {
            label
          }
        })}
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

export default translate(ExtrinsicDisplay);
