// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AbiMessage } from '@polkadot/api-contract/types';

import React from 'react';
import styled from 'styled-components';
import { Icon, Tooltip } from '@polkadot/react-components';
import { encodeTypeDef } from '@polkadot/types';
import { stringCamelCase } from '@polkadot/util';

import { useTranslation } from '../translate';

const MAX_PARAM_LENGTH = 20;

export interface Props {
  asConstructor?: boolean;
  className?: string;
  message: AbiMessage;
  params?: any[];
  withTooltip?: boolean;
}

function truncate (param: string): string {
  return param.length > MAX_PARAM_LENGTH
    ? `${param.substring(0, MAX_PARAM_LENGTH / 2)}…${param.substring(param.length - MAX_PARAM_LENGTH / 2)}`
    : param;
}

function MessageSignature ({ className, message: { args, identifier, isConstructor, isMutating, returnType }, params = [], withTooltip = false }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <span className='ui--MessageSignature-name'>{stringCamelCase(identifier)}</span>
      {' '}({args.map(({ name, type }, index): React.ReactNode => {
        return (
          <React.Fragment key={`${name}-args-${index}`}>
            {name}:
            {' '}
            <span className='ui--MessageSignature-type'>
              {params && params[index]
                ? <b>{truncate((params as string[])[index].toString())}</b>
                : encodeTypeDef(type)
              }
            </span>
            {index < (args.length) - 1 && ', '}
          </React.Fragment>
        );
      })})
      {(!isConstructor && returnType) && (
        <>
          :
          {' '}
          <span className='ui--MessageSignature-returnType'>
            {encodeTypeDef(returnType)}
          </span>
        </>
      )}
      {isMutating && (
        <>
          <Icon
            className='ui--MessageSignature-mutates'
            icon='database'
            tooltip={`mutates-${identifier}`}
          />
          {withTooltip && (
            <Tooltip
              text={t<string>('Mutates contract state')}
              trigger={`mutates-${identifier}`}
            />
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(styled(MessageSignature)`
  font-family: monospace;
  font-weight: normal;
  flex-grow: 1;

  .ui--MessageSignature-mutates {
    color: #ff8600;
    margin-left: 0.5rem;
    opacity: 0.6;
  }

  .ui--MessageSignature-name {
    color: #2f8ddb;
    font-weight: bold;
  }

  .ui--MessageSignature-type {
    color: #21a2b2;
  }

  .ui--MessageSignature-returnType {
    color: #ff8600;
  }
`);
