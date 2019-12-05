// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps, StringOrNull } from '@polkadot/react-components/types';
import { ComponentProps } from '../types';

import React, { useState, useEffect } from 'react';
import { PromiseContract as ApiContract } from '@polkadot/api-contract';
import { withApi, withMulti } from '@polkadot/react-api';
import { Button, CardGrid } from '@polkadot/react-components';

import translate from '../translate';
import Add from './Add';
import ContractCard from './Contract';
import Call from './Call';
import { getContractForAddress } from './util';

interface Props extends ComponentProps, I18nProps, ApiProps {}

function filterContracts ({ api, accounts, contracts: keyringContracts }: Props): ApiContract[] {
  return accounts && keyringContracts && Object.keys(keyringContracts)
    .map((address): ApiContract | null => getContractForAddress(api, address))
    .filter((contract: ApiContract | null): boolean => !!contract) as ApiContract[];
}

function Contracts (props: Props): React.ReactElement<Props> {
  const { accounts, basePath, contracts: keyringContracts, hasCode, showDeploy, t } = props;
  // const { callAddress, callMessage, isAddOpen, isCallOpen } = this.state;

  const [contracts, setContracts] = useState<ApiContract[]>(filterContracts(props));
  const [callContractIndex, setCallContractIndex] = useState<number>(0);
  const [callMessageIndex, setCallMessageIndex] = useState<number>(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);

  useEffect((): void => {
    setContracts(filterContracts(props));
  }, [accounts, keyringContracts]);

  let callContract = contracts[callContractIndex] || null;

  useEffect((): void => {
    callContract = contracts[callContractIndex];
  }, [callContractIndex]);

  const _toggleAdd = (): void => setIsAddOpen(!isAddOpen);
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
        emptyText={t('No contracts available')}
        buttons={
          <Button.Group>
            {hasCode && (
              <>
                <Button
                  icon='cloud upload'
                  isPrimary
                  label={t('Deploy a code hash')}
                  onClick={showDeploy()}
                />
                <Button.Or />
              </>
            )}
            <Button
              icon='add'
              isPrimary
              label={t('Add an existing contract')}
              onClick={_toggleAdd}
            />
          </Button.Group>
        }
      >
        {contracts
          .map((contract: ApiContract, index): React.ReactNode => {
            return (
              <ContractCard
                basePath={basePath}
                contract={contract}
                key={contract.address.toString()}
                onCall={_onCall(index)}
              />
            );
          })}
      </CardGrid>
      <Add
        basePath={basePath}
        isOpen={isAddOpen}
        onClose={_toggleAdd}
      />
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

export default withMulti(
  Contracts,
  translate,
  withApi
);
