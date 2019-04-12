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
import ValidateCode from './ValidateCode';
import store from './store';
import translate from './translate';

type Props = ComponentProps & I18nProps;

type State = {
  abi?: string | null,
  accountId?: string | null,
  codeHash?: string | null,
  gasLimit: BN,
  isAbiValid: boolean,
  isBusy: boolean,
  isCodeValid: boolean,
  isNameValid: boolean,
  isNew: boolean,
  isWasmValid: boolean,
  name?: string | null,
  wasm?: Uint8Array | null
};

class Deploy extends React.PureComponent<Props, State> {
  state: State = {
    accountId: null,
    gasLimit: new BN(0),
    isAbiValid: true,
    isBusy: false,
    isCodeValid: false,
    isNew: true,
    isNameValid: false,
    isWasmValid: false
  };

  render () {
    const { t } = this.props;
    const { isNew } = this.state;

    return (
      <div className='contracts--Code'>
        <Button.Group isBasic isCentered>
          <Button
            isBasic
            isNegative={isNew}
            label={t('deploy new')}
            onClick={this.toggleNew}
          />
          <Button
            isBasic
            isNegative={!isNew}
            label={t('attach existing')}
            onClick={this.toggleNew}
          />
        </Button.Group>
        {
          isNew
            ? this.renderDeploy()
            : this.renderExisting()
        }
      </div>
    );
  }

  private renderDeploy () {
    const { t } = this.props;
    const { accountId, gasLimit, isAbiValid, isBusy, isNameValid, isWasmValid, wasm } = this.state;
    const isValid = !isBusy && isAbiValid && isNameValid && isWasmValid && !gasLimit.isZero() && !!accountId;

    return (
      <>
        <InputAddress
          help={t('Specify the user account to use for this deployment. And fees will be deducted from this account.')}
          label={t('deployment account')}
          onChange={this.onChangeAccount}
          type='account'
        />
        <InputFile
          help={t('The compiled WASM for the contract that you wish to deploy. Each unique code blob will be attached with a code hash that can be used to create new instances.')}
          isError={!isWasmValid}
          label={t('compiled contract WASM')}
          onChange={this.onAddWasm}
          placeholder={
            wasm && !isWasmValid
              ? t('The code is not recognized as being in valid WASM format')
              : null
          }
        />
        {this.renderInputName()}
        {this.renderInputAbi()}
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
      </>
    );
  }

  private renderExisting () {
    const { t } = this.props;
    const { codeHash, isAbiValid, isCodeValid, isNameValid } = this.state;
    const isValid = isAbiValid && isCodeValid && isNameValid;

    return (
      <>
        <Input
          autoFocus
          help={t('The code hash for the on-chain deployed code.')}
          isError={!isCodeValid}
          label={t('code hash')}
          onChange={this.onChangeHash}
          value={codeHash}
        />
        <ValidateCode
          codeHash={codeHash}
          onChange={this.onValidateCode}
        />
        {this.renderInputName()}
        {this.renderInputAbi()}
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            label={t('Save')}
            onClick={this.onSave}
          />
        </Button.Group>
      </>
    );
  }

  private renderInputAbi () {
    const { t } = this.props;
    const { isAbiValid } = this.state;

    return (
      <ABI
        help={t('The ABI for the WASM code. In this step it is optional, but setting it here simplifies the setup of contract instances.')}
        isError={!isAbiValid}
        label={t('contract ABI (optional)')}
        onChange={this.onAddAbi}
      />
    );
  }

  private renderInputName () {
    const { t } = this.props;
    const { isNameValid, name } = this.state;

    return (
      <Input
        help={t('A name for this WASM code that helps to user distinguish. Only used for display purposes.')}
        isError={!isNameValid}
        label={t('code bundle name')}
        onChange={this.onChangeName}
        value={name}
      />
    );
  }

  private onAddAbi = (abi: string | null): void => {
    this.setState({ abi, isAbiValid: !!abi });
  }

  private onAddWasm = (wasm: Uint8Array, name: string): void => {
    const isWasmValid = wasm.subarray(0, 4).toString() === '0,97,115,109'; // '\0asm'

    this.setState({ wasm: compactAddLength(wasm), isWasmValid });
    this.onChangeName(name);
  }

  private onChangeAccount = (accountId: string | null): void => {
    this.setState({ accountId });
  }

  private onChangeGas = (gasLimit: BN | undefined): void => {
    this.setState({ gasLimit: gasLimit || new BN(0) });
  }

  private onChangeHash = (codeHash: string): void => {
    this.setState({ codeHash, isCodeValid: false });
  }

  private onChangeName = (name: string): void => {
    this.setState({ name, isNameValid: name.length !== 0 });
  }

  private onValidateCode = (isCodeValid: boolean): void => {
    this.setState({ isCodeValid });
  }

  private toggleBusy = (): void => {
    this.setState(({ isBusy }) => ({
      isBusy: !isBusy
    }));
  }

  private toggleNew = (): void => {
    this.setState(({ isNew }) => ({
      abi: null,
      codeHash: null,
      isAbiValid: true,
      isCodeValid: false,
      isNameValid: false,
      name: '',
      isNew: !isNew
    }));
  }

  private onSave = (): void => {
    const { abi, codeHash, name } = this.state;

    if (!codeHash || !name) {
      return;
    }

    store.saveCode(new Hash(codeHash), { abi, name }).catch((error) => {
      console.error('Unable to save code', error);
    });

    this.redirect();
  }

  private onSuccess = (result: SubmittableResult): void => {
    const record = result.findRecord('contract', 'CodeStored');

    if (record) {
      const codeHash = record.event.data[0];

      this.setState(({ abi, name }) => {
        if (!codeHash || !name) {
          return;
        }

        store.saveCode(codeHash as Hash, { abi, name }).catch((error) => {
          console.error('Unable to save code', error);
        });

        this.redirect();
      });
    }

    this.toggleBusy();
  }

  private redirect () {
    window.location.hash = this.props.basePath;
  }
}

export default translate(Deploy);
