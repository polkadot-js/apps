// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ContractCallOutcome } from '@polkadot/api-contract/types';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { Table } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Contract from './Contract';
import Call from './Call';
import { getContractForAddress } from './util';

export interface Props {
  contracts: string[];
  updated: number;
}

interface Indexes {
  contractIndex: number;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome) => void;
}

function filterContracts (api: ApiPromise, keyringContracts: string[] = []): ContractPromise[] {
  return keyringContracts
    .map((address) => getContractForAddress(api, address.toString()))
    .filter((contract): contract is ContractPromise => !!contract);
}

function Contracts ({ contracts: keyringContracts }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ contractIndex, messageIndex, onCallResult }, setIndexes] = useState<Indexes>({ contractIndex: 0, messageIndex: 0 });
  const [isCallOpen, setIsCallOpen] = useState(false);

  const headerRef = useRef<[string?, string?, number?][]>([
    [t('contracts'), 'start'],
    [undefined, undefined, 2],
    [t('status'), 'start'],
    [undefined, 'media--1100'],
    []
  ]);

  const contracts = useMemo(
    () => filterContracts(api, keyringContracts),
    [api, keyringContracts]
  );

  const _toggleCall = useCallback(
    () => setIsCallOpen((isCallOpen) => !isCallOpen),
    []
  );

  const _onCall = useCallback(
    (contractIndex: number, messageIndex: number, onCallResult: (messageIndex: number, result?: ContractCallOutcome) => void): void => {
      setIndexes({ contractIndex, messageIndex, onCallResult });
      setIsCallOpen(true);
    },
    []
  );

  const _setMessageIndex = useCallback(
    (messageIndex: number) => setIndexes((state) => ({ ...state, messageIndex })),
    []
  );

  const contract = contracts[contractIndex] || null;

  return (
    <>
      <Table
        empty={t<string>('No contracts available')}
        header={headerRef.current}
      >
        {contracts.map((contract, index): React.ReactNode => (
          <Contract
            contract={contract}
            index={index}
            key={contract.address.toString()}
            onCall={_onCall}
          />
        ))}
      </Table>
      {isCallOpen && contract && (
        <Call
          contract={contract}
          isOpen={isCallOpen}
          messageIndex={messageIndex}
          onCallResult={onCallResult}
          onChangeMessage={_setMessageIndex}
          onClose={_toggleCall}
        />
      )}
    </>
  );
}

export default React.memo(Contracts);
