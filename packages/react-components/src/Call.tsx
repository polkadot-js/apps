// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Codec, IExtrinsic, IMethod, TypeDef } from '@polkadot/types/types';
import { BareProps, I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { GenericCall, getTypeDef } from '@polkadot/types';
import Params from '@polkadot/react-params';
import { formatBalance } from '@polkadot/util';

import Static from './Static';
import { classes } from './util';
import translate from './translate';

export interface Props extends I18nProps, BareProps {
  children?: React.ReactNode;
  value: IExtrinsic | IMethod;
  withHash?: boolean;
  mortality?: string;
  tip?: BN;
}

function Call ({ children, className, style, mortality, tip, value, withHash, t }: Props): React.ReactElement<Props> {
  const params = GenericCall.filterOrigin(value.meta).map(({ name, type }): { name: string; type: TypeDef } => ({
    name: name.toString(),
    type: getTypeDef(type.toString())
  }));
  const values = value.args.map((value): { isValid: boolean; value: Codec } => ({
    isValid: true,
    value
  }));
  const hash = withHash
    ? (value as IExtrinsic).hash
    : null;

  return (
    <div
      className={classes('ui--Extrinsic', className)}
      style={style}
    >
      {children}
      {hash && (
        <Static
          className='hash'
          label={t('extrinsic hash')}
        >
          {hash.toHex()}
        </Static>
      )}
      {mortality && (
        <Static
          className='mortality'
          label={t('lifetime')}
        >
          {mortality}
        </Static>
      )}
      {tip && tip.gtn(0) && (
        <Static
          className='tip'
          label={t('tip')}
        >
          {formatBalance(tip)}
        </Static>
      )}
      <Params
        isDisabled
        params={params}
        values={values}
      />
    </div>
  );
}

export default translate(
  styled(Call)`
    .hash .ui--Static {
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: unset;
      word-wrap: unset;
    }
  `
);
