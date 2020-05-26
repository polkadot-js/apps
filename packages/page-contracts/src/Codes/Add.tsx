// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { createType } from '@polkadot/types';
import { registry } from '@polkadot/react-api';
import { Button, Input } from '@polkadot/react-components';

import ContractModal, { ContractModalProps as Props, ContractModalState } from '../Modal';
import ValidateCode from './ValidateCode';
import store from '../store';
import translate from '../translate';

interface State extends ContractModalState {
  codeHash: string;
  isBusy: boolean;
  isCodeValid: boolean;
}

class Add extends ContractModal<Props, State> {
  constructor (props: Props) {
    super(props);
    this.defaultState = {
      ...this.defaultState,
      codeHash: '',
      isBusy: false,
      isCodeValid: false
    };
    this.state = this.defaultState;
    this.headerText = props.t('Add an existing code hash');
  }

  protected renderContent = (): React.ReactNode => {
    const { t } = this.props;
    const { codeHash, isBusy, isCodeValid } = this.state;

    return (
      <>
        <Input
          autoFocus
          help={t<string>('The code hash for the on-chain deployed code.')}
          isDisabled={isBusy}
          isError={!isCodeValid}
          label={t<string>('code hash')}
          onChange={this.onChangeHash}
          onEnter={this.submit}
          value={codeHash}
        />
        <ValidateCode
          codeHash={codeHash}
          onChange={this.onValidateCode}
        />
        {this.renderInputName()}
        {this.renderInputAbi()}
      </>
    );
  }

  protected renderButtons = (): React.ReactNode => {
    const { t } = this.props;
    const { isBusy, isCodeValid, isNameValid } = this.state;
    const isValid = !isBusy && isCodeValid && isNameValid;

    return (
      <Button
        icon='save'
        isDisabled={!isValid}
        isPrimary
        label={t<string>('Save')}
        onClick={this.onSave}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ref={this.button}
      />
    );
  }

  private onChangeHash = (codeHash: string): void => {
    this.setState({ codeHash, isCodeValid: false });
  }

  private onValidateCode = (isCodeValid: boolean): void => {
    this.setState({ isCodeValid });
  }

  private onSave = (): void => {
    const { abi, codeHash, name, tags } = this.state;

    if (!codeHash || !name) {
      return;
    }

    this.setState({ isBusy: true }, (): void => {
      store
        .saveCode(createType(registry, 'Hash', codeHash), { abi, name, tags })
        .then((): void => {
          this.setState(
            { isBusy: false },
            (): void => this.onClose()
          );
        })
        .catch((error): void => {
          console.error('Unable to save code', error);
          this.setState({ isBusy: false });
        });
    });

    // this.redirect();
  }
}

export default translate(Add);
