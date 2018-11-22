// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ExtrinsicFunction } from '@polkadot/extrinsics/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { RawParam$OnChange } from '@polkadot/ui-app/Params/types';

import React from 'react';
import { Extrinsic } from '@polkadot/types';

import BaseExtrinsic from '../Extrinsic';
import translate from '../translate';

type Props = I18nProps & {
  defaultValue: ExtrinsicFunction,
  isDisabled?: boolean,
  isError?: boolean,
  isPrivate: boolean,
  label: string,
  onChange?: RawParam$OnChange,
  withLabel?: boolean
};

class ExtrinsicDisplay extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isDisabled, isError, isPrivate, label, style, t, withLabel } = this.props;

    return (
      <BaseExtrinsic
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        isPrivate={isPrivate}
        labelMethod={t('proposal.method', {
          defaultValue: '{{label}} (extrinsic)',
          replace: {
            label
          }
        })}
        labelSection={t('proposal.method', {
          defaultValue: '{{label}} (section)',
          replace: {
            label
          }
        })}
        onChange={this.onChange}
        style={style}
        withLabel={withLabel}
      />
    );
  }

  onChange = (extrinsic: Extrinsic): void => {
    const { onChange } = this.props;

    onChange && onChange({
      isValid: !!extrinsic,
      value: extrinsic
    });
  }
}

export default translate(ExtrinsicDisplay);
