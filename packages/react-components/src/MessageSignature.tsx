// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { classes } from '@canvas-ui/react-util';
import React from 'react';
import styled from 'styled-components';

import { AbiMessage } from '@polkadot/api-contract/types';
import { encodeTypeDef, TypeRegistry } from '@polkadot/types';
import { CodecArg } from '@polkadot/types/types';

import Icon from './Icon';
import MessageArg from './MessageArg';
import Tooltip from './Tooltip';
import { useTranslation } from './translate';
import { BareProps } from './types';

interface Props extends BareProps {
  message: AbiMessage;
  params?: CodecArg[];
  registry: TypeRegistry;
  withTooltip?: boolean;
}

function MessageSignature ({ className, message: { args, identifier, isConstructor, isMutating, isPayable, returnType }, params = [], registry, withTooltip = false }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={classes(className, isConstructor && 'isConstructor')}>
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
              registry={registry}
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
            {encodeTypeDef({
              ...returnType,
              ...(
                (returnType.displayName || '').length > 0
                  ? { displayName: returnType.displayName }
                  : {}
              )
            })}
          </span>
        </>
      )}
      {isMutating && (
        <>
          <Icon
            className='ui--MessageSignature-icon'
            data-for={`mutates-${identifier}`}
            data-tip
            icon='database'
          />
          {withTooltip && (
            <Tooltip
              text={t<string>('Mutates contract state')}
              trigger={`mutates-${identifier}`}
            />
          )}
        </>
      )}
      {isPayable && (
        <>
          <Icon
            className='ui--MessageSignature-icon'
            data-for={`payable-${identifier}`}
            data-tip
            icon='paper-plane'
          />
          {withTooltip && (
            <Tooltip
              text={t<string>('Payable')}
              trigger={`payable-${identifier}`}
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

    .ui--MessageSignature-icon {
      color: var(--orange-primary);
      margin-left: 0.5rem;
      opacity: 0.6;
    }

    .ui--MessageSignature-name {
      color: var(--orange-primary);
      font-weight: bold;
    }

    &.isConstructor .ui--MessageSignature-name {
      color: var(--blue-primary);
    }

    .ui--MessageSignature-type {
    }

    .ui--MessageSignature-returnType {
    }
  `
);
