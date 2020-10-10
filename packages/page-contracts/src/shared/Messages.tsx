// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Abi, PromiseContract } from '@polkadot/api-contract';
import { Expander, IconLink } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Message from './Message';
import { useTranslation } from '../translate';

export interface Props {
  className?: string;
  contract?: PromiseContract;
  contractAbi: Abi;
  isLabelled?: boolean;
  isRemovable?: boolean;
  isWatching?: boolean;
  onRemove?: () => void;
  onSelect?: (messageIndex: number) => void;
  onSelectConstructor?: (constructorIndex: number) => void;
  withConstructors?: boolean;
  withMessages?: boolean;
}

const NOOP = (): void => undefined;
const READ_ADDR = '0x'.padEnd(66, '0');

function sortMessages (messages: AbiMessage[]): [AbiMessage, number][] {
  return messages
    .map((m, index): [AbiMessage, number] => [m, index])
    .sort((a, b) => a[0].identifier.localeCompare(b[0].identifier))
    .sort((a, b) => a[0].isMutating === b[0].isMutating
      ? 0
      : a[0].isMutating
        ? -1
        : 1
    );
}

function Messages ({ className = '', contract, contractAbi: { constructors, messages }, isLabelled, isRemovable, isWatching, onRemove = NOOP, onSelect, onSelectConstructor, withConstructors, withMessages } : Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall(api.derive.chain.bestNumber);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastResults, setLastResults] = useState<(ContractCallOutcome | undefined)[]>([]);

  const _onExpander = useCallback(
    (isOpen: boolean): void => {
      isWatching && setIsUpdating(isOpen);
    },
    [isWatching]
  );

  useEffect((): void => {
    const maxWeight = api.consts.system.maximumBlockWeight.muln(64).divn(100);

    bestNumber && contract && isUpdating && Promise
      .all(messages.map((m) =>
        m.isMutating || m.args.length !== 0
          ? Promise.resolve(undefined)
          : contract.read(m, 0, maxWeight).send(READ_ADDR)
      ))
      .then(setLastResults)
      .catch(console.error);
  }, [api, bestNumber, contract, isUpdating, isWatching, messages]);

  return (
    <div className={`ui--Messages ${className} ${isLabelled ? 'labelled' : ''}`}>
      {withConstructors && (
        <Expander summary={t<string>('Constructors ({{count}})', { replace: { count: constructors.length } })}>
          {sortMessages(constructors).map(([message, index]) => (
            <Message
              index={index}
              key={index}
              message={message}
              onSelect={onSelectConstructor}
            />
          ))}
        </Expander>
      )}
      {withMessages && (
        <Expander
          onClick={_onExpander}
          summary={t<string>('Messages ({{count}})', { replace: { count: messages.length } })}
        >
          {sortMessages(messages).map(([message, index]) => (
            <Message
              index={index}
              key={index}
              lastResult={lastResults[index]}
              message={message}
              onSelect={onSelect}
            />
          ))}
        </Expander>
      )}
      {isRemovable && (
        <IconLink
          className='remove-abi'
          icon='remove'
          label={t<string>('Remove ABI')}
          onClick={onRemove}
        />
      )}
    </div>
  );
}

export default React.memo(styled(Messages)`
  padding-bottom: 0.75rem !important;

  .remove-abi {
    float: right;
    margin-top: 0.5rem;

    &:hover, &:hover :not(i) {
      text-decoration: underline;
    }
  }

  &.labelled {
    background: white;
    box-sizing: border-box;
    border: 1px solid rgba(34,36,38,.15);
    border-radius: .28571429rem;
    padding: 1rem 1rem 0.5rem;
    width: 100%;
  }
`);
