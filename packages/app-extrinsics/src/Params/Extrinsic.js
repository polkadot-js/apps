// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { Props as BaseProps } from '@polkadot/ui-app/Params/types';
import type { I18nProps } from '@polkadot/ui-app/types';
import type { EncodedMessage } from '../types';

import React from 'react';

import BaseExtrinsic from '../Extrinsic';
import translate from '../translate';

type Props = BaseProps & I18nProps & {
  defaultValue: Extrinsic,
  isPrivate: boolean,
  withLabel?: boolean,
};

class CExtrinsic extends React.PureComponent<Props> {
  render (): React$Node {
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

  onChange = ({ isValid, value }: EncodedMessage): void => {
    const { index, onChange } = this.props;

    onChange(index, {
      isValid,
      value
    });
  }
}

export default translate(CExtrinsic);
