// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props as BaseProps } from '@polkadot/ui-react-app/Params/types';
import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { EncodedMessage } from '../types';

import React from 'react';
import extrinsics from '@polkadot/extrinsics-substrate';

import Extrinsic from '../Extrinsic';
import translate from '../translate';

type Props = BaseProps & I18nProps;

const defaultValue = extrinsics.consensus.methods.private.setCode;

function Proposal ({ className, index, isError, onChange, label, style, t }: Props): React$Node {
  const _onChange = ({ isValid, value }: EncodedMessage): void =>
    onChange(index, {
      isValid,
      value
    });

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
      onChange={_onChange}
      style={style}
    />
  );
}

export default translate(Proposal);
