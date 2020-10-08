// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { InkMessage } from '@canvas-ui/api-contract/types';
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
  message: InkMessage;
  params?: CodecArg[];
  withTooltip?: boolean;
}

function MessageSignature ({ className, message: { args, identifier, isConstructor, mutates, returnType }, params = [], withTooltip = false }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={classes(className, isConstructor && 'asConstructor')}>
      <span className='ui--MessageSignature-name'>
        {identifier}
      </span>
      (
      {args.map((arg, index): React.ReactNode => {
        return (
          <React.Fragment key={arg.name}>
            <MessageArg
              arg={arg}
              param={params[index]}
            />
            {index < args.length - 1 && ', '}
          </React.Fragment>
        );
      })}
      )
      {(!isConstructor && returnType) && (
        <>
          :
          {' '}
          <span className='ui--MessageSignature-returnType'>
            {displayType({ ...returnType.type, displayName: returnType.displayName })}
          </span>
        </>
      )}
      {mutates && (
        <>
          <Icon
            className='ui--MessageSignature-mutates'
            data-for={`mutates-${identifier}`}
            data-tip
            name='database'
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
