// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { Button, Dropdown, InputAddress, InputBalance, InputNumber, TxButton } from '@polkadot/ui-app';
import { ContractAbi } from '@polkadot/types';

import store from './store';
import translate from './translate';
import Params from './Params';

type Props = ComponentProps & I18nProps;

type State = {
  accountId: string | null,
  address?: string,
  contractAbi?: ContractAbi | null,
  endowment: BN,
  gasLimit: BN,
  isAddressValid: boolean,
  isBusy: boolean,
  method?: string | null,
  params: Array<any>
};

class Call extends React.PureComponent<Props, State> {
  state: State = {
    accountId: null,
    endowment: new BN(0),
    gasLimit: new BN(0),
    isAddressValid: false,
    isBusy: false,
    params: []
  };

  render () {
    const { t } = this.props;
    const { accountId, address, contractAbi, gasLimit, isAddressValid, method } = this.state;
    const contractOptions = store.getAllContracts().map(({ json: { address, name } }) => ({
      text: `${name} (${address})`,
      value: address
    }));
    const methodOptions = contractAbi
      ? Object.keys(contractAbi.messages).map((key) => {
        const fn = contractAbi.messages[key];
        const type = fn.type ? `: ${fn.type}` : '';
        const args = fn.args.map(({ name, type }) => `${name}: ${type}`);
        const text = `${key}(${args.join(', ')})${type}`;

        return {
          key,
          text,
          value: key
        };
      })
      : [];
    const defaultContract = contractOptions.length
      ? contractOptions[contractOptions.length - 1].value
      : undefined;
    const isEndowValid = true; // !endowment.isZero();
    const isGasValid = !gasLimit.isZero();
    const isValid = !!accountId && isEndowValid && isGasValid && isAddressValid;

    return (
      <div className='contracts--Call'>
        <InputAddress
          help={t('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
          label={t('call from account')}
          onChange={this.onChangeAccount}
          type='account'
        />
        <Dropdown
          defaultValue={defaultContract}
          help={t('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
          isError={!isAddressValid}
          label={t('contract to use')}
          onChange={this.onChangeAddress}
          options={contractOptions}
          value={address}
        />
        <Dropdown
          defaultValue={method}
          help={t('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
          isError={!method}
          label={t('message to send')}
          onChange={this.onChangeMethod}
          options={methodOptions}
          value={method}
        />
        <Params
          onChange={this.onChangeParams}
          params={
            method && contractAbi && contractAbi.messages[method]
              ? contractAbi.messages[method].args
              : undefined
          }
        />
        <InputBalance
          help={t('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
          isError={!isEndowValid}
          label={t('value')}
          onChange={this.onChangeEndowment}
        />
        <InputNumber
          help={t('The maximum amount of gas that can be used by this deployment, if the code requires more, the deployment will fail.')}
          isError={!isGasValid}
          label={t('maximum gas allowed')}
          onChange={this.onChangeGas}
        />
        <Button.Group>
          <TxButton
            accountId={accountId}
            isDisabled={!isValid}
            isPrimary
            label={t('Call')}
            onClick={this.toggleBusy}
            onFailed={this.toggleBusy}
            onSuccess={this.toggleBusy}
            params={this.constructCall}
            tx='contract.call'
          />
        </Button.Group>
      </div>
    );
  }

  private constructCall = (): Array<any> => {
    const { address, contractAbi, endowment, gasLimit, method, params } = this.state;

    if (!contractAbi || !method) {
      return [];
    }

    return [address, endowment, gasLimit, contractAbi.messages[method](...params)];
  }

  private onChangeAccount = (accountId: string | null): void => {
    this.setState({ accountId });
  }

  private onChangeAddress = (address: string): void => {
    const contract = store.getContract(address);
    const contractAbi = contract
    ? contract.contractAbi
    : null;

    this.setState({ address, contractAbi, isAddressValid: !!contractAbi });
    this.onChangeMethod(
      contractAbi
        ? Object.keys(contractAbi.messages)[0]
        : null
    );
  }

  private onChangeEndowment = (endowment?: BN | null): void => {
    this.setState({ endowment: endowment || new BN(0) });
  }

  private onChangeGas = (gasLimit: BN | undefined): void => {
    this.setState({ gasLimit: gasLimit || new BN(0) });
  }

  private onChangeMethod = (method: string | null): void => {
    this.setState({ method, params: [] });
  }

  private onChangeParams = (params: Array<any>): void => {
    this.setState({ params });
  }

  private toggleBusy = (): void => {
    this.setState(({ isBusy }) => ({
      isBusy: !isBusy
    }));
  }
}

export default translate(Call);
