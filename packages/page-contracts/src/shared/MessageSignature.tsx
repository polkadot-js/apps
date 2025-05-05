// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AbiMessage } from '@polkadot/api-contract/types';

import React from 'react';

import { Icon, styled, Tooltip } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { encodeTypeDef } from '@polkadot/types/create';

import { useTranslation } from '../translate.js';

const MAX_PARAM_LENGTH = 20;

export interface Props {
  asConstructor?: boolean;
  className?: string;
  message: AbiMessage;
  params?: unknown[];
  withTooltip?: boolean;
}

function truncate (param: string): string {
  return param.length > MAX_PARAM_LENGTH
    ? `${param.substring(0, MAX_PARAM_LENGTH / 2)}…${param.substring(param.length - MAX_PARAM_LENGTH / 2)}`
    : param;
}

function MessageSignature ({ className, message: { args, isConstructor, isMutating, method, returnType }, params = [], withTooltip = false }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  return (
    <StyledDiv className={className}>
      <span className='ui--MessageSignature-name'>{method}</span>
      {' '}({args.map(({ name, type }, index): React.ReactNode => {
        return (
          <React.Fragment key={`${name}-args-${index}`}>
            {name}:
            {' '}
            <span className='ui--MessageSignature-type'>
              {params?.[index]
                ? <b>{truncate((params as string[])[index].toString())}</b>
                : encodeTypeDef(api.registry, type)
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
            {encodeTypeDef(api.registry, returnType)}
          </span>
        </>
      )}
      {isMutating && (
        <>
          <Icon
            className='ui--MessageSignature-mutates'
            icon='database'
            tooltip={`mutates-${method}`}
          />
          {withTooltip && (
            <Tooltip
              text={t('Mutates contract state')}
              trigger={`mutates-${method}`}
            />
          )}
        </>
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  font: var(--font-mono);
  font-weight: var(--font-weight-normal);
  flex-grow: 1;

  .ui--MessageSignature-mutates {
    color: #ff8600;
    margin-left: 0.5rem;
    opacity: var(--opacity-light);
  }

  .ui--MessageSignature-name {
    color: #2f8ddb;
    font-weight: var(--font-weight-normal);
  }

  .ui--MessageSignature-type {
    color: #21a2b2;
  }

  .ui--MessageSignature-returnType {
    color: #ff8600;
  }
`;

export default React.memo(MessageSignature);
