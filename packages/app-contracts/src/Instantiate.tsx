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
import Params from './Params';
import store from './store';
import translate from './translate';

type Props = ComponentProps & I18nProps;

type State = {
  abi?: string | null,
  accountId: string | null,
  codeHash?: string,
  contractAbi?: ContractAbi | null,
  endowment: BN,
  gasLimit: BN,
  isAbiValid: boolean,
  isAbiSupplied: boolean,
  isBusy: boolean,
  isHashValid: boolean,
  isNameValid: boolean,
  name?: string,
  params: Array<any>
};

class Create extends React.PureComponent<Props, State> {
  state: State = {
    accountId: null,
    endowment: new BN(0),
    gasLimit: new BN(0),
    isAbiValid: false,
    isAbiSupplied: false,
    isBusy: false,
    isHashValid: false,
    isNameValid: false,
    params: []
  };

  render () {
    const { t } = this.props;
    const { accountId, codeHash, contractAbi, endowment, gasLimit, isAbiSupplied, isAbiValid, isHashValid, isNameValid, name } = this.state;
    const isEndowValid = !endowment.isZero();
    const isGasValid = !gasLimit.isZero();
    const isValid = isAbiValid && isHashValid && isEndowValid && isGasValid && !!accountId;
    const codeOptions = store.getAllCode().map(({ json: { codeHash, name } }) => ({
      text: `${name} (${codeHash})`,
      value: codeHash
    }));
    const defaultCode = codeOptions.length
      ? codeOptions[codeOptions.length - 1].value
      : undefined;
    const constructOptions = contractAbi
      ? (() => {
        const args = contractAbi.deploy.args.map(({ name, type }) => name + ': ' + type);
        const text = `deploy(${args.join(', ')})`;

        return [{
          key: 'deploy',
          text,
          value: 'deploy'
        }];
      })()
      : [];

    return (
      <div className='contracts--Instantiate'>
        <InputAddress
          help={t('Specify the user account to use for this contract creation. And fees will be deducted from this account.')}
          label={t('deployment account')}
          onChange={this.onChangeAccount}
          type='account'
        />
        <Dropdown
          defaultValue={defaultCode}
          help={t('The contract WASM previously deployed. Internally this is identified by the hash of the code, as either created or attached.')}
          isError={!isHashValid}
          label={t('code for this contract')}
          onChange={this.onChangeCode}
          options={codeOptions}
          value={codeHash}
        />
        <Input
          help={t('A name for the final deployed contract helps to user distinguish. Only used for display purposes.')}
          isError={!isNameValid}
          label={t('contract name')}
          onChange={this.onChangeName}
          value={name}
        />
        {
          isAbiSupplied
            ? null
            : (
              <ABI
                help={t('The ABI for the WASM code. Since we will be making a call into the code, the ABI is required and stored for future operations such as sending messages.')}
                isError={!isAbiValid}
                label={t('Contract ABI')}
                onChange={this.onAddAbi}
              />
            )
        }
        {
          contractAbi
            ? (
              <Dropdown
                defaultValue='deploy'
                help={t('The deployment constructor information for this contract, as provided by the ABI.')}
                isDisabled
                label={t('constructor')}
                options={constructOptions}
                value='deploy'
              />
            )
            : null
        }
        <Params
          onChange={this.onChangeParams}
          params={
            contractAbi
              ? contractAbi.deploy.args
              : undefined
          }
        />
        <InputBalance
          help={t('The allotted endownment for this contract, i.e. the amount transferred to the contract upon instantiation.')}
          isError={!isEndowValid}
          label={t('endowment')}
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
    const { codeHash, contractAbi, endowment, gasLimit, params } = this.state;

    if (!contractAbi) {
      return [];
    }

    return [endowment, gasLimit, codeHash, contractAbi.deploy(...params)];
  }

  private onAddAbi = (abi: string | null, contractAbi: ContractAbi | null, isAbiSupplied: boolean = false): void => {
    this.setState({ abi, contractAbi, isAbiSupplied, isAbiValid: !!abi });
  }

  private onChangeAccount = (accountId: string | null): void => {
    this.setState({ accountId });
  }

  private onChangeCode = (codeHash: string): void => {
    const code = store.getCode(codeHash);

    this.setState({ codeHash, isHashValid: !!code });

    if (code) {
      if (code.contractAbi) {
        this.onAddAbi(code.json.abi, code.contractAbi, true);
      } else {
        this.onAddAbi(null, null, false);
      }

      this.onChangeName(`${code.json.name} (instance)`);
    }
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

  private onChangeParams = (params: Array<any>): void => {
    this.setState({ params });
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
