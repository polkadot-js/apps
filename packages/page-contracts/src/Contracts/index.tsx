// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StringOrNull } from '@polkadot/react-components/types';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { ContractPromise as ApiContract } from '@polkadot/api-contract';
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

function filterContracts (api: ApiPromise, keyringContracts: string[] = []): ApiContract[] {
  return keyringContracts
    .map((address): ApiContract | null => getContractForAddress(api, address.toString()))
    .filter((contract: ApiContract | null): contract is ApiContract => !!contract);
}

function Contracts ({ contracts: keyringContracts }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [contractIndex, setContractIndex] = useState<number>(0);
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [isCallOpen, setIsCallOpen] = useState(false);

  const headerRef = useRef<[string?, string?, number?][]>([
    [t('contracts'), 'start'],
    [undefined, undefined, 2],
    [t('status'), 'start'],
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

  const _onChangeCallContractAddress = (newCallContractAddress: StringOrNull): void => {
    const index = contracts.findIndex(({ address }: ApiContract) => newCallContractAddress === address.toString());

    if (index > -1) {
      index !== contractIndex && setMessageIndex(0);
      setContractIndex(index);
    }
  };

  const _onChangeCallMessageIndex = useCallback(
    (messageIndex: number) => contracts[contractIndex] && setMessageIndex(messageIndex || 0),
    [contractIndex, contracts]
  );

  const _onCall = useCallback(
    (contractIndex: number) =>
      (messageIndex?: number): void => {
        setContractIndex(contractIndex);
        setMessageIndex(messageIndex || 0);
        setIsCallOpen(true);
      },
    []
  );

  const contract = contracts[contractIndex] || null;

  return (
    <>
      <Table
        empty={t<string>('No contracts available')}
        header={headerRef.current}
      >
        {contracts.map((contract: ApiContract, index): React.ReactNode => (
          <Contract
            contract={contract}
            key={contract.address.toString()}
            onCall={_onCall(index)}
          />
        ))}
      </Table>
      {isCallOpen && contract && (
        <Call
          contract={contract}
          isOpen={isCallOpen}
          messageIndex={messageIndex}
          onChangeCallContractAddress={_onChangeCallContractAddress}
          onChangeCallMessageIndex={_onChangeCallMessageIndex}
          onClose={_toggleCall}
        />
      )}
    </>
  );
}

export default React.memo(Contracts);
