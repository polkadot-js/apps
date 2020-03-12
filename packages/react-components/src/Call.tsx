// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { Codec, IExtrinsic, IMethod, TypeDef } from '@polkadot/types/types';
import { BareProps } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GenericCall, getTypeDef } from '@polkadot/types';
import Params from '@polkadot/react-params';
import { FormatBalance } from '@polkadot/react-query';

import Static from './Static';
import { classes } from './util';
import { useTranslation } from './translate';

export interface Props extends BareProps {
  children?: React.ReactNode;
  labelHash?: React.ReactNode;
  mortality?: string;
  onError?: () => void;
  value: IExtrinsic | IMethod;
  withBorder?: boolean;
  withHash?: boolean;
  tip?: BN;
}

interface Param {
  name: string;
  type: TypeDef;
}

interface Value {
  isValid: boolean;
  value: Codec;
}

function Call ({ children, className, labelHash, mortality, onError, style, tip, value, withBorder, withHash }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ hash, params, values }, setExtracted] = useState<{ hash: Hash | null; params: Param[]; values: Value[] }>({ hash: null, params: [], values: [] });

  useEffect((): void => {
    const params = GenericCall.filterOrigin(value.meta).map(({ name, type }): Param => ({
      name: name.toString(),
      type: getTypeDef(type.toString())
    }));
    const values = value.args.map((value): Value => ({
      isValid: true,
      value
    }));
    const hash = withHash
      ? value.hash
      : null;

    setExtracted({ hash, params, values });
  }, [value, withHash]);

  return (
    <div
      className={classes('ui--Extrinsic', className)}
      style={style}
    >
      <Params
        isDisabled
        onError={onError}
        params={params}
        values={values}
        withBorder={withBorder}
      />
      {children}
      <div className='ui--Extrinsic--toplevel'>
        {hash && (
          <Static
            className='hash'
            label={labelHash || t('extrinsic hash')}
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
        {tip?.gtn(0) && (
          <Static
            className='tip'
            label={t('tip')}
          >
            <FormatBalance value={tip} />
          </Static>
        )}
      </div>
    </div>
  );
}

export default React.memo(styled(Call)`
  .hash .ui--Static {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: unset;
    word-wrap: unset;
  }

  .ui--Extrinsic--toplevel {
    margin-top: 0.75rem;

    .ui--Labelled {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
