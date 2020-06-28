// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIMessage } from '@polkadot/api-contract/types';
import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { displayType } from '@polkadot/types';

import { ACCENT_LIGHT_HEX, SECONDARY_LIGHT_HEX } from './styles/constants';
import Icon from './Icon';
import Tooltip from './Tooltip';
import { useTranslation } from './translate';
import { classes } from './util';

const MAX_PARAM_LENGTH = 20;

export interface Props extends BareProps {
  asConstructor?: boolean;
  message: ContractABIMessage;
  params?: any[];
  withTooltip?: boolean;
}

function truncate (param: string): string {
  return param.length > MAX_PARAM_LENGTH
    ? `${param.substring(0, MAX_PARAM_LENGTH / 2)}…${param.substring(param.length - MAX_PARAM_LENGTH / 2)}`
    : param;
}

function MessageSignature ({ className, message: { args, mutates, name, returnType }, params = [], asConstructor = false, withTooltip = false }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={classes(className, asConstructor && 'asConstructor')}>
      <span className='ui--MessageSignature-name'>
        {name}
      </span>
      (
      {args.map(({ name, type }, index): React.ReactNode => {
        return (
          <React.Fragment key={`${name}-args-${index}`}>
            {name}:
            {' '}
            <span className='ui--MessageSignature-type'>
              {params && params[index]
                ? <b>{truncate((params as string[])[index].toString())}</b>
                : displayType(type)
              }
            </span>
            {index < args.length - 1 && ', '}
          </React.Fragment>
        );
      })}
      )
      {(!asConstructor && returnType) && (
        <>
          :
          {' '}
          <span className='ui--MessageSignature-returnType'>
            {displayType(returnType)}
          </span>
        </>
      )}
      {mutates && (
        <>
          <Icon
            className='ui--MessageSignature-mutates'
            data-for={`mutates-${name}`}
            data-tip
            name='database'
          />
          {withTooltip && (
            <Tooltip
              text={t<string>('Mutates contract state')}
              trigger={`mutates-${name}`}
            />
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(
  styled(MessageSignature)`
    font-family: monospace;
    font-weight: normal;
    flex-grow: 1;

    .ui--MessageSignature-mutates {
      color: ${SECONDARY_LIGHT_HEX};
      margin-left: 0.5rem;
      opacity: 0.6;
    }

    .ui--MessageSignature-name {
      color: ${SECONDARY_LIGHT_HEX};
      font-weight: bold;  
    }

    &.asConstructor .ui--MessageSignature-name {
      color: ${ACCENT_LIGHT_HEX};
    }

    .ui--MessageSignature-type {
    }

    .ui--MessageSignature-returnType {
    }
  `
);
