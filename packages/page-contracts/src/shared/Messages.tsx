// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ContractPromise } from '@polkadot/api-contract';
import type { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';
import type { Option } from '@polkadot/types';
import type { ContractInfo } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Abi } from '@polkadot/api-contract';
import { Expander } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Message from './Message';

export interface Props {
  className?: string;
  contract?: ContractPromise;
  contractAbi: Abi;
  isLabelled?: boolean;
  isWatching?: boolean;
  trigger?: number;
  onSelect?: (messageIndex: number, resultCb: (messageIndex: number, result?: ContractCallOutcome) => void) => void;
  onSelectConstructor?: (constructorIndex: number) => void;
  withConstructors?: boolean;
  withMessages?: boolean;
  withWasm?: boolean;
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

function Messages ({ className = '', contract, contractAbi: { constructors, info: { source }, messages }, isLabelled, isWatching, onSelect, onSelectConstructor, trigger, withConstructors, withMessages, withWasm }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const optInfo = useCall<Option<ContractInfo>>(contract && api.query.contracts.contractInfoOf, [contract?.address]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastResults, setLastResults] = useState<(ContractCallOutcome | void)[]>([]);

  const _onExpander = useCallback(
    (isOpen: boolean): void => {
      isWatching && setIsUpdating(isOpen);
    },
    [isWatching]
  );

  const _onRefresh = useCallback(
    (): void => {
      optInfo && contract &&
        Promise
          .all(messages.map((m) =>
            m.isMutating || m.args.length !== 0
              ? Promise.resolve(undefined)
              : contract
                .query[m.method](READ_ADDR, { gasLimit: -1, value: 0 })
                .catch((e: Error) => console.error(`contract.query.${m.method}:: ${e.message}`))
          ))
          .then(setLastResults)
          .catch(console.error);
    },
    [contract, messages, optInfo]
  );

  useEffect((): void => {
    (isUpdating || trigger) && optInfo && contract && _onRefresh();
  }, [_onRefresh, contract, isUpdating, optInfo, trigger]);

  const _setMessageResult = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (messageIndex: number, result?: ContractCallOutcome): void => {
      // ignore
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
      {withWasm && source.wasm.length !== 0 && (
        <div>{t<string>('{{size}} WASM bytes', { replace: { size: formatNumber(source.wasm.length) } })}</div>
      )}
    </div>
  );
}

export default React.memo(styled(Messages)`
  padding-bottom: 0.75rem !important;

  &.isLabelled {
    background: var(--bg-input);
    box-sizing: border-box;
    border: 1px solid var(--border-input);
    border-radius: .28571429rem;
    padding: 1rem 1rem 0.5rem;
    width: 100%;
  }
`);
