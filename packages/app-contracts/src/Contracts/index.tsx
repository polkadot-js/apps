// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallContract, NullContract, I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from '../types';

import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Button, CardGrid } from '@polkadot/react-components';

import translate from '../translate';
import Add from './Add';
import Contract from './Contract';
import Call from './Call';
import { getContractForAddress } from './util';

interface Props extends ComponentProps, I18nProps, RouteComponentProps {}

function Contracts (props: Props): React.ReactElement<Props> {
  const { accounts, basePath, contracts, hasCode, showDeploy, t } = props;
  // const { callAddress, callMethod, isAddOpen, isCallOpen } = this.state;

  const [callContract, setCallContract] = useState<CallContract | null>(null);
  const [callMethodIndex, setCallMethodIndex] = useState<number | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);

  const _toggleAdd = (): void => setIsAddOpen(!isAddOpen);
  const _toggleCall = (): void => setIsCallOpen(!isCallOpen);

  const _onChangeCallContract = (newCallContract: CallContract): void => {
    if (callContract && newCallContract.address !== callContract.address) {
      setCallMethodIndex(0);
    }
    setCallContract(callContract);
  };
  const _onChangeCallMethodIndex = (callMethodIndex: number): void => {
    !!callContract && setCallMethodIndex(callMethodIndex);
  };
  const _onCall = (callContract: CallContract): (_?: number) => () => void => {
    return function (callMethodIndex?: number): () => void {
      return function (): void {
        setCallContract(callContract);
        setCallMethodIndex(callMethodIndex || 0);
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
        {(accounts && contracts && Object.keys(contracts)
          .map((address): CallContract | NullContract => getContractForAddress(address))
          .filter(({ abi, address }: CallContract | NullContract): boolean => !!address && !!abi) as CallContract[])
          .map((contract: CallContract): React.ReactNode => {
            return (
              <Contract
                basePath={basePath}
                contract={contract}
                key={contract.address}
                onCall={_onCall}
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
        callMethodIndex={callMethodIndex}
        isOpen={isCallOpen}
        onChangeCallContract={_onChangeCallContract}
        onChangeCallMethodIndex={_onChangeCallMethodIndex}
        onClose={_toggleCall}
      />
    </>
  );
}

export default translate(withRouter(Contracts));
