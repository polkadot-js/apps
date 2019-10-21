// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIMethod } from '@polkadot/api-contract/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { displayType } from '@polkadot/types';

import Icon from './Icon';
import Tooltip from './Tooltip';
import translate from './translate';

export interface Props extends I18nProps {
  asConstructor?: boolean;
  message: ContractABIMethod;
  withTooltip?: boolean;
}

const Signature = styled.div`
  font-family: monospace;
  font-weight: normal;

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

function MessageSignature ({ message: { args, mutates, name, returnType }, asConstructor = false, withTooltip = false, t }: Props): React.ReactElement<Props> {
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
              {displayType(type)}
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
            data-tip
            data-for={`mutates-${name}`}
            name="database"
            className="mutates"
          />
          {withTooltip && (
            <Tooltip
              trigger={`mutates-${name}`}
              text={t('Mutates contract state')}
            />
          )}
        </>
      )}
    </Signature>
  );
}

export default translate(MessageSignature);
