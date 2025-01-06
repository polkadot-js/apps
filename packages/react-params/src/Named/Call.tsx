// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExtrinsicSignature } from '@polkadot/types/interfaces';
import type { Codec, IExtrinsic, IMethod, TypeDef } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import type { ComponentMap } from '../types.js';

import React, { useEffect, useState } from 'react';

import { Static, styled } from '@polkadot/react-components';
import Params from '@polkadot/react-params';
import { FormatBalance } from '@polkadot/react-query';
import { Enum, getTypeDef } from '@polkadot/types';

import { balanceCalls, balanceCallsOverrides } from '../overrides.js';
import { useTranslation } from '../translate.js';

export interface Props {
  callName?: string;
  children?: React.ReactNode;
  className?: string;
  labelHash?: React.ReactNode;
  labelSignature?: React.ReactNode;
  mortality?: string;
  onError?: () => void;
  value?: IExtrinsic | IMethod | null;
  withBorder?: boolean;
  withExpander?: boolean;
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
  hash?: string | null;
  overrides?: ComponentMap;
  params?: Param[];
  signature: string | null;
  signatureType: string | null;
  values?: Value[];
}

function isExtrinsic (value: unknown): value is IExtrinsic {
  return !!(value as IExtrinsic).signature;
}

// This is no doubt NOT the way to do things - however there is no other option
function getRawSignature (value: IExtrinsic): ExtrinsicSignature | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  return (value as any)._raw?.signature?.multiSignature as ExtrinsicSignature;
}

function extractState (value?: IExtrinsic | IMethod | null, withHash?: boolean, withSignature?: boolean, callName?: string): Extracted {
  const overrides = callName && balanceCalls.includes(callName)
    ? balanceCallsOverrides
    : undefined;
  const params = value?.meta.args.map(({ name, type }): Param => ({
    name: name.toString(),
    type: getTypeDef(type.toString())
  }));
  const values = value?.args.map((value): Value => ({
    isValid: true,
    value
  }));
  const hash = withHash
    ? value?.hash.toHex()
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

  return { hash, overrides, params, signature, signatureType, values };
}

function Call ({ callName, children, className = '', labelHash, labelSignature, mortality, onError, tip, value, withBorder, withExpander, withHash, withSignature }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ hash, overrides, params, signature, signatureType, values }, setExtracted] = useState<Extracted>({ hash: null, params: [], signature: null, signatureType: null, values: [] });

  useEffect((): void => {
    setExtracted(extractState(value, withHash, withSignature, callName));
  }, [callName, value, withHash, withSignature]);

  return (
    <StyledDiv className={`${className} ui--Call`}>
      <Params
        isDisabled
        onError={onError}
        overrides={overrides}
        params={params}
        registry={value?.registry}
        values={values}
        withBorder={withBorder}
        withExpander={withExpander}
      >
        {children}
        <div className='ui--Call--toplevel'>
          {hash && (
            <Static
              className='hash'
              label={labelHash || t('extrinsic hash')}
              value={hash}
              withCopy
            />
          )}
          {signature && (
            <Static
              className='hash'
              label={labelSignature || t('signature {{type}}', { replace: { type: signatureType ? `(${signatureType})` : '' } })}
              value={signature}
              withCopy
            />
          )}
          {mortality && (
            <Static
              className='mortality'
              label={t('lifetime')}
              value={mortality}
            />
          )}
          {tip?.gtn(0) && (
            <Static
              className='tip'
              label={t('tip')}
              value={<FormatBalance value={tip} />}
            />
          )}
        </div>
      </Params>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .ui--Labelled.hash .ui--Static {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: unset;
    word-wrap: unset;
    white-space: nowrap;
  }

  .ui--Call--toplevel {
    margin-top: 0;

    .ui--Labelled {
      &:last-child > .ui--Labelled-content > .ui--Static {
        margin-bottom: 0;
      }

      > .ui--Labelled-content > .ui--Static {
        background: var(--bg-static-extra);
      }

      + .ui--Labelled > .ui--Labelled-content > .ui--Static {
        margin-top: 0;
      }
    }
  }

  > .ui--Params {
    margin-top: -0.25rem;
  }
`;

export default React.memo(Call);
