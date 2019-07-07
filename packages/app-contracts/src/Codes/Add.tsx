// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Button, Input } from '@polkadot/ui-app';
import { Hash } from '@polkadot/types';

import ContractModal, { ContractModalProps, ContractModalState } from '../Modal';
import ValidateCode from './ValidateCode';
import store from '../store';
import translate from '../translate';

type Props = ContractModalProps;

type State = ContractModalState & {
  codeHash: string,
  isBusy: boolean,
  isCodeValid: boolean
};

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

  renderContent = () => {
    const { t } = this.props;
    const { codeHash, isBusy, isCodeValid } = this.state;

    return (
      <>
        <Input
          autoFocus
          help={t('The code hash for the on-chain deployed code.')}
          isDisabled={isBusy}
          isError={!isCodeValid}
          label={t('code hash')}
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

  renderButtons = () => {
    const { t } = this.props;
    const { isBusy, isCodeValid, isNameValid } = this.state;
    const isValid = !isBusy && isCodeValid && isNameValid;

    return (
      <Button.Group>
        {this.renderCancelButton()}
        <Button
          isDisabled={!isValid}
          isPrimary
          label={t('Save')}
          onClick={this.onSave}
          ref={this.button}
        />
      </Button.Group>
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

    this.setState(
      { isBusy: true },
      () => {
        store.saveCode(new Hash(codeHash), { abi, name, tags })
          .then(() => {
            this.setState(
              { isBusy: false },
              () => this.onClose()
            );
          })
          .catch((error) => {
            console.error('Unable to save code', error);
            this.setState({ isBusy: false });
          });
      }
    );

    // this.redirect();
  }
}

export default translate(Add);
