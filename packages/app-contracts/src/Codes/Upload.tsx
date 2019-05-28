// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';

import BN from 'bn.js';
import React from 'react';
import { Button, InputFile, TxButton } from '@polkadot/ui-app';
import { compactAddLength } from '@polkadot/util';
import { Hash } from '@polkadot/types';

import ContractModal, { ContractModalProps, ContractModalState } from '../Modal';
import store from '../store';
import translate from '../translate';

type Props = ContractModalProps;

type State = ContractModalState & {
  gasLimit: BN,
  isWasmValid: boolean,
  wasm?: Uint8Array | null
};

class Upload extends ContractModal<Props, State> {
  constructor (props: Props) {
    super(props);
    this.defaultState = {
      ...this.defaultState,
      isWasmValid: false,
      wasm: null
    };
    this.state = this.defaultState;
  }

  headerText = 'Upload WASM';

  renderContent = () => {
    const { t } = this.props;
    const { isBusy, isWasmValid, wasm } = this.state;

    return (
      <>
        {this.renderInputAccount()}
        <InputFile
          help={t('The compiled WASM for the contract that you wish to deploy. Each unique code blob will be attached with a code hash that can be used to create new instances.')}
          isDisabled={isBusy}
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
        {this.renderInputTags()}
        {this.renderInputAbi()}
        {this.renderInputGas()}
      </>
    );
  }

  renderButtons = () => {
    const { t } = this.props;
    const { accountId, gasLimit, isAbiValid, isBusy, isNameValid, isWasmValid, wasm } = this.state;
    const isValid = !isBusy && accountId && isAbiValid && isNameValid && isWasmValid && !gasLimit.isZero() && !!accountId;

    return (
      <Button.Group>
        <TxButton
          accountId={accountId}
          isDisabled={!isValid}
          isPrimary
          label={t('Deploy')}
          onClick={this.toggleBusy(true)}
          onSuccess={this.onSuccess}
          onFailed={this.toggleBusy(false)}
          params={[gasLimit, wasm]}
          tx='contract.putCode'
          ref={this.button}
        />
      </Button.Group>
    );
  }

  // private renderInputAbi () {
  //   const { t } = this.props;
  //   const { isAbiValid } = this.state;
  //
  //   return (
  //     <ABI
  //       help={t('The ABI for the WASM code. In this step it is optional, but setting it here simplifies the setup of contract instances.')}
  //       isError={!isAbiValid}
  //       label={t('contract ABI (optional)')}
  //       onChange={this.onAddAbi}
  //     />
  //   );
  // }
  //
  // private renderInputName () {
  //   const { t } = this.props;
  //   const { isNameValid, isNew, name } = this.state;
  //
  //   return (
  //     <Input
  //       help={t('A name for this WASM code that helps to user distinguish. Only used for display purposes.')}
  //       isError={!isNameValid}
  //       label={t('code bundle name')}
  //       onChange={this.onChangeName}
  //       onEnter={this[isNew ? 'sendTx' : 'submit']}
  //       value={name}
  //     />
  //   );
  // }

  // private onAddAbi = (abi: string | null): void => {
  //   this.setState({ abi, isAbiValid: !!abi });
  // }

  private onAddWasm = (wasm: Uint8Array, name: string): void => {
    const isWasmValid = wasm.subarray(0, 4).toString() === '0,97,115,109'; // '\0asm'

    this.setState({ wasm: compactAddLength(wasm), isWasmValid });
    this.onChangeName(name);
  }

  // private onChangeName = (name: string): void => {
  //   this.setState({ name, isNameValid: name.length !== 0 });
  // }

  // private toggleBusy = (): void => {
  //   this.setState(({ isBusy }) => ({
  //     isBusy: !isBusy
  //   }));
  // }

  private onSuccess = (result: SubmittableResult): void => {
    this.setState(({ abi, name, tags }) => {

      const record = result.findRecord('contract', 'CodeStored');

      if (record) {
        const codeHash = record.event.data[0];

        if (!codeHash || !name) {
          return;
        }

        store.saveCode(codeHash as Hash, { abi, name, tags })
          .catch((error: any) => {
            console.error('Unable to save code', error);
          })
          .then(() => this.onClose());

        return { isBusy: false } as State;
      }
      return { isBusy: false } as State;

    });

  }

  // private redirect () {
  //   window.location.hash = store.hasContracts
  //     ? `${this.props.basePath}/instantiate`
  //     : this.props.basePath;
  // }
}

export default translate(Upload);
