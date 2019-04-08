// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';
import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { Button, Dropdown, Input, InputAddress, InputBalance, InputNumber, TxButton } from '@polkadot/ui-app';
import { AccountId, ContractAbi } from '@polkadot/types';

import ABI from './ABI';
import store from './store';
import translate from './translate';

type Props = ComponentProps & I18nProps;

type State = {
  abi?: string | null,
  accountId: string | null,
  contractAbi?: ContractAbi | null,
  endowment: BN,
  gasLimit: BN,
  isAbiValid: boolean,
  isBusy: boolean,
  isHashValid: boolean,
  isNameValid: boolean,
  name?: string
};

class Create extends React.PureComponent<Props, State> {
  state: State = {
    accountId: null,
    endowment: new BN(0),
    gasLimit: new BN(0),
    isAbiValid: false,
    isBusy: false,
    isHashValid: false,
    isNameValid: false
  };

  render () {
    const { t } = this.props;
    const { accountId, isAbiValid, isHashValid, isNameValid } = this.state;
    const isValid = isAbiValid && isHashValid && !!accountId;

    return (
      <div className='contracts--Create'>
        <Input
          help={t('A name for this wasm code that helps to user distinguish. Only used for display purposes.')}
          isError={!isNameValid}
          label={t('Code bundle name')}
          onChange={this.onChangeName}
        />
        <Dropdown
          help={t('The contract WASM previous deployed. Internally this is identified by the hash of the code, as either created or attached.')}
          isError={!isHashValid}
          label={t('Code for deployment')}
          options={[]}
        />
        <ABI
          help={t('The ABI for the WASM code. Since we will be making a call into the code, the ABI is required and stored for future operations such as sending messages.')}
          isError={!isAbiValid}
          label={t('Contract ABI')}
          onChange={this.onAddAbi}
        />
        <InputAddress
          help={t('Specify the user account to use for this contract creation. And fees will be deducted from this account.')}
          label={t('deployment account')}
          onChange={this.onChangeAccount}
          type='account'
        />
        <InputBalance
          help={t('The allotted endownment for this contract, i.e. the amount transferred to the contract upon instantiation.')}
          label={t('endowment')}
          onChange={this.onChangeEndowment}
        />
        <InputNumber
          help={t('The maximum amount of gas that can be used by this deployment, if the code requires more, the deployment will fail.')}
          label={t('maximum gas allowed')}
          onChange={this.onChangeGas}
        />
        <Button.Group>
          <TxButton
            accountId={accountId}
            isDisabled={!isValid}
            isPrimary
            label={t('Instantiate')}
            onClick={this.toggleBusy}
            onFailed={this.toggleBusy}
            onSuccess={this.onSuccess}
            params={this.constructCall}
            tx='contract.create'
          />
        </Button.Group>
      </div>
    );
  }

  private constructCall = (): Array<any> => {
    const { contractAbi, endowment, gasLimit } = this.state;

    if (!contractAbi) {
      return [];
    }

    return [endowment, gasLimit, contractAbi.deploy()];
  }

  private onAddAbi = (abi: string | null, contractAbi: ContractAbi | null): void => {
    this.setState({ abi, contractAbi, isAbiValid: !!abi });
  }

  private onChangeAccount = (accountId: string | null): void => {
    this.setState({ accountId });
  }

  private onChangeEndowment = (endowment?: BN | null): void => {
    this.setState({ endowment: endowment || new BN(0) });
  }

  private onChangeGas = (gasLimit: BN | undefined): void => {
    this.setState({ gasLimit: gasLimit || new BN(0) });
  }

  private onChangeName = (name: string): void => {
    this.setState({ name, isNameValid: name.length !== 0 });
  }

  private toggleBusy = (): void => {
    this.setState(({ isBusy }) => ({
      isBusy: !isBusy
    }));
  }

  private onSuccess = (result: SubmittableResult): void => {
    const record = result.findRecord('contract', 'Instantiated');

    if (record) {
      const address = record.event.data[1];

      this.setState(({ abi, name }) => {
        store.saveContract(address as AccountId, { abi: abi as string, name });
      });
    }

    this.toggleBusy();
  }
}

export default translate(Create);
