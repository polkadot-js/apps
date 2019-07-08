// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';

import BN from 'bn.js';
import React from 'react';
import { withApi, withMulti } from '@polkadot/ui-api';
import { Button, InputFile, TxButton } from '@polkadot/ui-app';
import { compactAddLength } from '@polkadot/util';
import { Hash } from '@polkadot/types';

import ContractModal, { ContractModalProps, ContractModalState } from '../Modal';
import store from '../store';
import translate from '../translate';

type Props = ContractModalProps & ApiProps;

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
    this.headerText = props.t('Upload WASM');
  }

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
        {this.renderInputAbi()}
        {this.renderInputGas()}
      </>
    );
  }

  renderButtons = () => {
    const { api, t } = this.props;
    const { accountId, gasLimit, isBusy, isNameValid, isWasmValid, wasm } = this.state;
    const isValid = !isBusy && accountId && isNameValid && isWasmValid && !gasLimit.isZero() && !!accountId;

    return (
      <Button.Group>
        {this.renderCancelButton()}
        <TxButton
          accountId={accountId}
          isDisabled={!isValid}
          isPrimary
          label={t('Upload')}
          onClick={this.toggleBusy(true)}
          onSuccess={this.onSuccess}
          onFailed={this.toggleBusy(false)}
          params={[gasLimit, wasm]}
          tx={api.tx.contracts ? 'contracts.putCode' : 'contract.putCode'}
          ref={this.button}
        />
      </Button.Group>
    );
  }

  private onAddWasm = (wasm: Uint8Array, name: string): void => {
    const isWasmValid = wasm.subarray(0, 4).toString() === '0,97,115,109'; // '\0asm'

    this.setState({ wasm: compactAddLength(wasm), isWasmValid });
    this.onChangeName(name);
  }

  private onSuccess = (result: SubmittableResult): void => {
    const { api } = this.props;
    this.setState(({ abi, name, tags }) => {

      const section = api.tx.contracts ? 'contracts' : 'contract';
      const record = result.findRecord(section, 'CodeStored');

      if (record) {
        const codeHash = record.event.data[0];

        if (!codeHash || !name) {
          return;
        }

        store.saveCode(codeHash as Hash, { abi, name, tags })
          .then(() => this.onClose())
          .catch((error: any) => {
            console.error('Unable to save code', error);
          });
      }
      return { isBusy: false } as State;
    });
  }
}

export default withMulti(
  Upload,
  translate,
  withApi
);
