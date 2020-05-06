// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { ApiProps } from '@polkadot/react-api/types';

import BN from 'bn.js';
import React from 'react';
import { SubmittableResult } from '@polkadot/api';
import { withApi, withMulti } from '@polkadot/react-api/hoc';
import { InputFile, TxButton } from '@polkadot/react-components';
import { compactAddLength } from '@polkadot/util';

import ContractModal, { ContractModalProps, ContractModalState } from '../Modal';
import store from '../store';
import translate from '../translate';
import { DEFAULT_GAS_LIMIT } from '../constants';

interface Props extends ContractModalProps, ApiProps {}

interface State extends ContractModalState {
  gasLimit: BN;
  isGasLimit: boolean;
  isWasmValid: boolean;
  wasm?: Uint8Array | null;
}

const WASM_MAGIC = '0,97,115,109'; // '\0asm'

class Upload extends ContractModal<Props, State> {
  constructor (props: Props) {
    super(props);

    const { api, t } = this.props;

    this.defaultState = {
      ...this.defaultState,
      gasLimit: new BN(DEFAULT_GAS_LIMIT),
      isGasLimit: api.tx.contracts.putCode.meta.args.length === 2,
      isWasmValid: false,
      wasm: null
    };
    this.state = this.defaultState;
    this.headerText = t('Upload WASM');
  }

  protected renderContent = (): React.ReactNode => {
    const { t } = this.props;
    const { isBusy, isGasLimit, isWasmValid, wasm } = this.state;

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
        {this.renderInputAbi()}
        {isGasLimit && this.renderInputGas()}
      </>
    );
  }

  protected renderButtons = (): React.ReactNode => {
    const { t } = this.props;
    const { accountId, gasLimit, isBusy, isGasLimit, isNameValid, isWasmValid, wasm } = this.state;
    const isValid = !isBusy && !!accountId && isNameValid && isWasmValid && (isGasLimit || !gasLimit.isZero());

    return (
      <TxButton
        accountId={accountId}
        icon='upload'
        isDisabled={!isValid}
        isPrimary
        label={t('Upload')}
        onClick={this.toggleBusy(true)}
        onFailed={this.toggleBusy(false)}
        onSuccess={this.onSuccess}
        params={
          isGasLimit
            ? [gasLimit, wasm]
            : [wasm]
        }
        tx='contracts.putCode'
        withSpinner
      />
    );
  }

  private onAddWasm = (wasm: Uint8Array, name: string): void => {
    this.setState({
      isWasmValid: wasm.subarray(0, 4).toString() === WASM_MAGIC,
      wasm: compactAddLength(wasm)
    });
    this.onChangeName(name);
  }

  private onSuccess = (result: SubmittableResult): void => {
    this.setState(({ abi, name, tags }): Pick<State, never> | null => {
      const record = result.findRecord('contracts', 'CodeStored');

      if (record) {
        const codeHash = record.event.data[0];

        if (!codeHash || !name) {
          return null;
        }

        store.saveCode(codeHash as Hash, { abi, name, tags })
          .then((): void => this.onClose())
          .catch((error: any): void => {
            console.error('Unable to save code', error);
          });
      }

      return { isBusy: false };
    });
  }
}

export default withMulti(
  Upload,
  translate,
  withApi
);
