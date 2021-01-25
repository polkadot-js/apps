// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExtrinsicSignature } from '@polkadot/types/interfaces';
import type { Codec, IExtrinsic, IMethod, TypeDef } from '@polkadot/types/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Params from '@polkadot/react-params';
import { FormatBalance } from '@polkadot/react-query';
import { Enum, GenericCall, getTypeDef } from '@polkadot/types';

import Static from './Static';
import { useTranslation } from './translate';

export interface Props {
  children?: React.ReactNode;
  className?: string;
  labelHash?: React.ReactNode;
  labelSignature?: React.ReactNode;
  mortality?: string;
  onError?: () => void;
  value: IExtrinsic | IMethod;
  withBorder?: boolean;
  withHash?: boolean;
  withSignature?: boolean;
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

interface Extracted {
  hash: string | null;
  params: Param[];
  signature: string | null;
  signatureType: string | null;
  values: Value[];
}

function isExtrinsic (value: IExtrinsic | IMethod): value is IExtrinsic {
  return !!(value as IExtrinsic).signature;
}

// This is no doubt NOT the way to do things - however there is no other option
function getRawSignature (value: IExtrinsic): ExtrinsicSignature | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (value as any)._raw?.signature?.multiSignature as ExtrinsicSignature;
}

function extractState (value:IExtrinsic | IMethod, withHash?: boolean, withSignature?: boolean): Extracted {
  const params = GenericCall.filterOrigin(value.meta).map(({ name, type }): Param => ({
    name: name.toString(),
    type: getTypeDef(type.toString())
  }));
  const values = value.args.map((value): Value => ({
    isValid: true,
    value
  }));
  const hash = withHash
    ? value.hash.toHex()
    : null;
  let signature: string | null = null;
  let signatureType: string | null = null;

  if (withSignature && isExtrinsic(value) && value.isSigned) {
    const raw = getRawSignature(value);

    signature = value.signature.toHex();
    signatureType = raw instanceof Enum
      ? raw.type
      : null;
  }

  return { hash, params, signature, signatureType, values };
}

function Call ({ children, className = '', labelHash, labelSignature, mortality, onError, tip, value, withBorder, withHash, withSignature }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ hash, params, signature, signatureType, values }, setExtracted] = useState<Extracted>({ hash: null, params: [], signature: null, signatureType: null, values: [] });

  useEffect((): void => {
    setExtracted(extractState(value, withHash, withSignature));
  }, [value, withHash, withSignature]);

  return (
    <div className={`ui--Extrinsic ${className}`}>
      <Params
        isDisabled
        onError={onError}
        params={params}
        values={values}
        withBorder={withBorder}
      />
      {children}
      <div className='ui--Extrinsic--toplevel'>
        {signature && (
          <Static
            className='hash'
            label={labelSignature || t<string>('signature {{type}}', { replace: { type: signatureType ? `(${signatureType})` : '' } })}
            withCopy
          >
            {signature}
          </Static>
        )}
        {hash && (
          <Static
            className='hash'
            label={labelHash || t<string>('extrinsic hash')}
            withCopy
          >
            {hash}
          </Static>
        )}
        {mortality && (
          <Static
            className='mortality'
            label={t<string>('lifetime')}
          >
            {mortality}
          </Static>
        )}
        {tip?.gtn(0) && (
          <Static
            className='tip'
            label={t<string>('tip')}
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

      > label {
        left: 1.55rem !important;
      }
    }
  }
`);
