// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';
import { ContractInfo } from '@polkadot/types/interfaces';
import { ThemeProps } from '@polkadot/react-components/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Abi, ContractPromise } from '@polkadot/api-contract';
import { Expander } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import Message from './Message';
import { useTranslation } from '../translate';

export interface Props {
  className?: string;
  contract?: ContractPromise;
  contractAbi: Abi;
  isLabelled?: boolean;
  isWatching?: boolean;
  onSelect?: (messageIndex: number, resultCb: (messageIndex: number, result?: ContractCallOutcome) => void) => void;
  onSelectConstructor?: (constructorIndex: number) => void;
  withConstructors?: boolean;
  withMessages?: boolean;
}

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

function Messages ({ className = '', contract, contractAbi: { constructors, messages }, isLabelled, isWatching, onSelect, onSelectConstructor, withConstructors, withMessages } : Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const optInfo = useCall<Option<ContractInfo>>(contract && api.query.contracts.contractInfoOf, [contract?.address]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastResults, setLastResults] = useState<(ContractCallOutcome | undefined)[]>([]);

  const _onExpander = useCallback(
    (isOpen: boolean): void => {
      isWatching && setIsUpdating(isOpen);
    },
    [isWatching]
  );

  useEffect((): void => {
    isUpdating && optInfo && contract && Promise
      .all(messages.map((m) =>
        m.isMutating || m.args.length !== 0
          ? Promise.resolve(undefined)
          : contract.read(m, 0, -1).send(READ_ADDR).catch(() => undefined)
      ))
      .then(setLastResults)
      .catch(console.error);
  }, [contract, isUpdating, isWatching, messages, optInfo]);

  const _setMessageResult = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (messageIndex: number, result?: ContractCallOutcome): void => {
      // ignore... for now
      // setLastResults((all) => all.map((r, index) => index === messageIndex ? result : r));
    },
    []
  );

  const _onSelect = useCallback(
    (index: number) => onSelect && onSelect(index, _setMessageResult),
    [_setMessageResult, onSelect]
  );

  return (
    <div className={`ui--Messages ${className}${isLabelled ? ' isLabelled' : ''}`}>
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
              onSelect={_onSelect}
            />
          ))}
        </Expander>
      )}
    </div>
  );
}

export default React.memo(styled(Messages)(({ theme }: ThemeProps) => `
  padding-bottom: 0.75rem !important;

  &.isLabelled {
    background: ${theme.bgInput};
    box-sizing: border-box;
    border: 1px solid rgba(34,36,38,.15);
    border-radius: .28571429rem;
    padding: 1rem 1rem 0.5rem;
    width: 100%;
  }
`));
