// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Codec, IExtrinsic, IMethod } from '@polkadot/types/types';
import { BareProps, I18nProps } from './types';

import React from 'react';
import styled from 'styled-components';
import { Method, getTypeDef, TypeDef } from '@polkadot/types';
import Params from '@polkadot/ui-params';

import Static from './Static';
import { classes } from './util';
import translate from './translate';

export type Props = I18nProps & BareProps & {
  children?: React.ReactNode;
  value: IExtrinsic | IMethod;
  withHash?: boolean;
  mortality?: string;
};

const Wrapper = styled.div`
  .hash .ui--Static {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: unset;
    word-wrap: unset;
  }
`;

class Call extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { children, className, style, mortality, value, withHash, t } = this.props;
    const params = Method.filterOrigin(value.meta).map(({ name, type }): { name: string; type: TypeDef } => ({
      name: name.toString(),
      type: getTypeDef(type)
    }));
    const values = value.args.map((value): { isValid: boolean; value: Codec } => ({
      isValid: true,
      value
    }));
    const hash = withHash
      ? (value as IExtrinsic).hash
      : null;

    return (
      <Wrapper
        className={classes('ui--Extrinsic', className)}
        style={style}
      >
        {children}
        {
          hash
            ? (
              <Static
                className='hash'
                label={t('extrinsic hash')}
              >
                {hash.toHex()}
              </Static>
            )
            : null
        }
        {
          mortality
            ? (
              <Static
                className='mortality'
                label={t('lifetime')}
              >
                {mortality}
              </Static>
            )
            : null
        }
        <Params
          isDisabled
          params={params}
          values={values}
        />
      </Wrapper>
    );
  }
}

export default translate(Call);
