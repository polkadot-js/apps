// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';
import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { Button, Input, InputAddress, InputFile, InputNumber, TxButton } from '@polkadot/ui-app';
import { compactAddLength } from '@polkadot/util';
import { Hash } from '@polkadot/types';

import ABI from './ABI';
import store from './store';
import translate from './translate';

type Props = ComponentProps & I18nProps;

type State = {
  abi?: string | null,
  accountId?: string | null,
  gasLimit: BN,
  isAbiValid: boolean,
  isBusy: boolean,
  isNameValid: boolean,
  isWasmValid: boolean,
  name?: string,
  wasm?: Uint8Array | null
};

class Deploy extends React.PureComponent<Props, State> {
  state: State = {
    accountId: null,
    gasLimit: new BN(0),
    isAbiValid: true,
    isBusy: false,
    isNameValid: false,
    isWasmValid: false
  };

  render () {
    const { t } = this.props;
    const { accountId, gasLimit, isAbiValid, isBusy, isNameValid, isWasmValid, wasm } = this.state;
    const isValid = !isBusy && isAbiValid && isNameValid && isWasmValid && !gasLimit.isZero() && !!accountId;

    return (
      <div className='contracts--Deploy'>
        <Input
          help={t('A name for this wasm code that helps to user distinguish. Only used for display purposes.')}
          isError={!isNameValid}
          label={t('Code bundle name')}
          onChange={this.onChangeName}
        />
        <InputFile
          help={t('The compiled WASM for the contract that you wish to deploy. Ecah unique code blob will be attached with a code hash that can be used to create new instances.')}
          isError={!isWasmValid}
          label={t('Compiled contract WASM')}
          onChange={this.onAddWasm}
        />
        <ABI
          help={t('The ABI for the WASM code. In this step it is optional, but required once you wish to create contracts or call into deployed contracts.')}
          label={t('Contract ABI (optional)')}
          onChange={this.onAddAbi}
        />
        <InputAddress
          help={t('Specify the user account to use for this deployment. And fees will be deducted from this account.')}
          label={t('deployment account')}
          onChange={this.onChangeAccount}
          type='account'
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
            label={t('Deploy')}
            onClick={this.toggleBusy}
            onFailed={this.toggleBusy}
            onSuccess={this.onSuccess}
            params={[gasLimit, wasm]}
            tx='contract.putCode'
          />
        </Button.Group>
      </div>
    );
  }

  private onAddAbi = (abi: string | null): void => {
    this.setState({ abi, isAbiValid: !!abi });
  }

  private onAddWasm = (wasm: Uint8Array): void => {
    this.setState({ wasm: compactAddLength(wasm), isWasmValid: true });
  }

  private onChangeAccount = (accountId: string | null): void => {
    this.setState({ accountId });
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
    const record = result.findRecord('contract', 'CodeStored');

    if (record) {
      const codeHash = record.event.data[0];

      this.setState(({ abi, name }) => {
        store.saveCode(codeHash as Hash, { abi: abi as string, name });
      });
    }

    this.toggleBusy();
  }
}

export default translate(Deploy);
