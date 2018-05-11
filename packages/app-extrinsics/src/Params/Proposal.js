// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props as BaseProps } from '@polkadot/ui-app/Params/types';
import type { I18nProps } from '@polkadot/ui-app/types';
import type { EncodedMessage } from '../types';

import React from 'react';

import extrinsics from '@polkadot/extrinsics-substrate';

import Extrinsic from '../Extrinsic';
import translate from '../translate';

type Props = BaseProps & I18nProps;

const defaultValue = extrinsics.consensus.methods.private.setCode;

class Proposal extends React.PureComponent<Props> {
  render (): React$Node {
    const { className, isError, label, style, t } = this.props;

    return (
      <Extrinsic
        className={className}
        defaultValue={defaultValue}
        isError={isError}
        isPrivate
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

export default translate(Proposal);
