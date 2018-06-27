// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { SectionItem } from '@polkadot/params/types';
import { Extrinsics } from '@polkadot/extrinsics/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { RawParam$OnChange } from '@polkadot/ui-app/Params/types';
import { EncodedMessage } from '@polkadot/ui-signer/types';

import React from 'react';

import BaseExtrinsic from '../Extrinsic';
import translate from '../translate';

type Props = I18nProps & {
  defaultValue: SectionItem<Extrinsics>,
  isDisabled?: boolean,
  isError?: boolean,
  isPrivate: boolean,
  label: string,
  onChange: RawParam$OnChange,
  withLabel?: boolean
};

class Extrinsic extends React.PureComponent<Props> {
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

  onChange = ({ isValid, values }: EncodedMessage): void => {
    const { onChange } = this.props;

    onChange({
      isValid,
      value: (values[0] as Uint8Array)
    });
  }
}

export default translate(Extrinsic);
