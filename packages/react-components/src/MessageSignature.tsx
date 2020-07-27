// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIMessage } from '@polkadot/api-contract/types';
import { BareProps } from '@canvas-ui/react-components/types';
import { CodecArg } from '@polkadot/types/types';

import React from 'react';
import styled from 'styled-components';
import { displayType } from '@polkadot/types';

import Icon from './Icon';
import MessageArg from './MessageArg';
import Tooltip from './Tooltip';
import { useTranslation } from './translate';
import { classes } from '@canvas-ui/react-util';

export interface Props extends BareProps {
  asConstructor?: boolean;
  message: ContractABIMessage;
  params?: CodecArg[];
  withTooltip?: boolean;
}

function MessageSignature ({ className, message: { args, mutates, name, returnType }, params = [], asConstructor = false, withTooltip = false }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={classes(className, asConstructor && 'asConstructor')}>
      <span className='ui--MessageSignature-name'>
        {name}
      </span>
      (
      {args.map((arg, index): React.ReactNode => {
        return (
          <MessageArg
            arg={arg}
            key={arg.name}
            param={params[index]}
          />
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
      color: var(--orange-primary);
      margin-left: 0.5rem;
      opacity: 0.6;
    }

    .ui--MessageSignature-name {
      color: var(--orange-primary);
      font-weight: bold;
    }

    &.asConstructor .ui--MessageSignature-name {
      color: var(--blue-primary);
    }

    .ui--MessageSignature-type {
    }

    .ui--MessageSignature-returnType {
    }
  `
);
