// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';
import { ComponentProps as Props } from '../types';

import React, { useState, useEffect } from 'react';
import { ApiPromise } from '@polkadot/api';
import { PromiseContract as ApiContract } from '@polkadot/api-contract';
import { Button, CardGrid } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Add from './Add';
import ContractCard from './Contract';
import Call from './Call';
import { getContractForAddress } from './util';

function filterContracts (api: ApiPromise, { accounts, contracts: keyringContracts }: Props): ApiContract[] {
  return accounts && keyringContracts && keyringContracts
    .map((address): ApiContract | null => getContractForAddress(api, address.toString()))
    .filter((contract: ApiContract | null): boolean => !!contract) as ApiContract[];
}

function Contracts (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { accounts, contracts: keyringContracts, hasCode, onShowDeploy } = props;
  const [contracts, setContracts] = useState<ApiContract[]>(filterContracts(api, props));
  const [callContractIndex, setCallContractIndex] = useState<number>(0);
  const [callMessageIndex, setCallMessageIndex] = useState<number>(0);
  const [isCallOpen, setIsCallOpen] = useState(false);

  useEffect((): void => {
    setContracts(filterContracts(api, props));
  }, [accounts, api, keyringContracts, props]);

  const callContract = contracts[callContractIndex] || null;

  const _toggleCall = (): void => setIsCallOpen(!isCallOpen);

  const _onChangeCallContractAddress = (newCallContractAddress: StringOrNull): void => {
    const index = contracts.findIndex(({ address }: ApiContract): boolean => newCallContractAddress === address.toString());

    if (index > -1) {
      index !== callContractIndex && setCallMessageIndex(0);
      setCallContractIndex(index);
    }
  };

  const _onChangeCallMessageIndex = (callMessageIndex: number): void => {
    !!callContract && setCallMessageIndex(callMessageIndex);
  };

  const _onCall = (callContractIndex: number): (_?: number) => () => void => {
    return function (callMessageIndex?: number): () => void {
      return function (): void {
        setCallContractIndex(callContractIndex);
        setCallMessageIndex(callMessageIndex || 0);
        setIsCallOpen(true);
      };
    };
  };

  return (
    <>
      <CardGrid
        buttons={
          <Button.Group isCentered>
            {hasCode && (
              <Button
                icon='upload'
                label={t('Deploy a code hash')}
                onClick={onShowDeploy()}
              />
            )}
            <Add />
          </Button.Group>
        }
        emptyText={t<string>('No contracts available')}
      >
        {contracts.map((contract: ApiContract, index): React.ReactNode => (
          <ContractCard
            contract={contract}
            key={contract.address.toString()}
            onCall={_onCall(index)}
          />
        ))}
      </CardGrid>
      <Call
        callContract={callContract}
        callMessageIndex={callMessageIndex}
        isOpen={isCallOpen}
        onChangeCallContractAddress={_onChangeCallContractAddress}
        onChangeCallMessageIndex={_onChangeCallMessageIndex}
        onClose={_toggleCall}
      />
    </>
  );
}

export default React.memo(Contracts);
