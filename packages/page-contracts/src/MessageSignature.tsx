// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIMessage } from '@polkadot/api-contract/types';

import React from 'react';
import styled from 'styled-components';
import { Icon, Tooltip } from '@polkadot/react-components';
import { displayType } from '@polkadot/types';

import { useTranslation } from './translate';

const MAX_PARAM_LENGTH = 20;

export interface Props {
  asConstructor?: boolean;
  message: ContractABIMessage;
  params?: any[];
  withTooltip?: boolean;
}

const Signature = styled.div`
  font-family: monospace;
  font-weight: normal;
  flex-grow: 1;

  .mutates {
    color: #ff8600;
    margin-left: 0.5rem;
    opacity: 0.6;
  }
`;

const Name = styled.span`
  color: #2f8ddb;
  font-weight: bold;
`;

const Type = styled.span`
  color: #21a2b2;
`;

const ReturnType = styled.span`
  color: #ff8600;
`;

function truncate (param: string): string {
  return param.length > MAX_PARAM_LENGTH
    ? `${param.substring(0, MAX_PARAM_LENGTH / 2)}…${param.substring(param.length - MAX_PARAM_LENGTH / 2)}`
    : param;
}

function MessageSignature ({ message: { args, mutates, name, returnType }, params = [], asConstructor = false, withTooltip = false }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Signature>
      <Name>
        {name}
      </Name>
      (
      {args.map(({ name, type }, index): React.ReactNode => {
        return (
          <React.Fragment key={`${name}-args-${index}`}>
            {name}:
            {' '}
            <Type>
              {params && params[index]
                ? (
                  <b>
                    {truncate(params[index].toString())}
                  </b>
                )
                : displayType(type)}
            </Type>
            {index < args.length - 1 && ', '}
          </React.Fragment>
        );
      })}
      )
      {(!asConstructor && returnType) && (
        <>
          :
          {' '}
          <ReturnType>
            {displayType(returnType)}
          </ReturnType>
        </>
      )}
      {mutates && (
        <>
          <Icon
            className="mutates"
            data-for={`mutates-${name}`}
            data-tip
            name="database"
          />
          {withTooltip && (
            <Tooltip
              text={t('Mutates contract state')}
              trigger={`mutates-${name}`}
            />
          )}
        </>
      )}
    </Signature>
  );
}

export default React.memo(MessageSignature);
