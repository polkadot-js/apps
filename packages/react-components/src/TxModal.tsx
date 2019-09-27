// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Button, InputAddress, Modal, TxButton, TxComponent } from '@polkadot/react-components';

export interface TxModalProps extends I18nProps {
  onSubmit?: () => void;
  onClose?: () => void;
  onSuccess?: () => void;
  onFailed?: () => void;
}

export interface TxModalState {
  accountId?: string | null;
  isBusy: boolean;
  isOpen: boolean;
}

export default class TxModal<P extends TxModalProps, S extends TxModalState> extends TxComponent<P, S> {
  protected defaultState: S = {
    accountId: null,
    isOpen: false,
    isBusy: false
  } as unknown as S;

  public state: S = this.defaultState;

  public render (): React.ReactNode {
    const { isOpen } = this.state;

    return (
      <>
        {this.renderTrigger && this.renderTrigger()}
        <Modal
          className='ui--Modal'
          dimmer='inverted'
          onClose={this.hideModal}
          open={isOpen}
        >
          <Modal.Header>
            {this.headerText()}
          </Modal.Header>
          <Modal.Content>
            {this.renderPreContent()}
            {this.renderInputAccount()}
            {this.renderContent()}
          </Modal.Content>
          <Modal.Actions>
            {this.renderButtons()}
          </Modal.Actions>
        </Modal>
      </>
    );
  }

  protected headerText = (): React.ReactNode => '';

  protected accountHelp = (): React.ReactNode => this.props.t('Select the account to use for this action.');

  protected accountLabel = (): React.ReactNode => this.props.t('using my account');

  protected submitLabel = (): React.ReactNode => this.props.t('Submit');

  protected cancelLabel = (): React.ReactNode => this.props.t('Cancel');

  protected onChangeAccount = (accountId: string | null): void => {
    this.setState({ accountId });
  }

  protected onSubmit = (): void => {
    const { onSubmit } = this.props;

    this.toggleBusy(true);
    onSubmit && onSubmit();
  }

  protected onSuccess = (): void => {
    const { onClose, onSuccess } = this.props;

    onSuccess && onSuccess();
    onClose && onClose();
    this.hideModal();
  }

  protected onFailed = (): void => {
    const { onFailed } = this.props;

    this.toggleBusy(false);
    onFailed && onFailed();
  }

  protected isDisabled = (): boolean => {
    const { accountId } = this.state;

    return !accountId;
  }

  protected toggleBusy = (isBusy: boolean): () => void =>
    (): void => {
      this.setState({
        isBusy
      });
    }

  protected isUnsigned: () => boolean = (): boolean => false;

  protected txMethod: () => string = (): string => '';

  protected txParams: () => any[] = (): any[] => [];

  protected renderContent: () => React.ReactNode = (): React.ReactNode => null;

  protected renderPreContent: () => React.ReactNode = (): React.ReactNode => null;

  protected renderTrigger?: () => React.ReactNode = (): React.ReactNode => null;

  protected renderButtons: () => React.ReactNode = (): React.ReactNode => {
    return (
      <Button.Group>
        {this.renderCancelButton()}
        {this.renderTxButton()}
      </Button.Group>
    );
  }

  protected renderInputAccount (): React.ReactNode {
    const { accountId, isBusy } = this.state;

    return (
      <InputAddress
        defaultValue={accountId}
        help={this.accountHelp()}
        isDisabled={isBusy}
        isInput={false}
        label={this.accountLabel()}
        onChange={this.onChangeAccount}
        type='account'
        value={accountId}
      />
    );
  }

  protected renderTxButton (): React.ReactNode {
    const { accountId } = this.state;

    return (
      <TxButton
        {...(
          this.isUnsigned()
            ? { isUnsigned: true }
            : { accountId }
        )}
        isDisabled={this.isDisabled()}
        isPrimary
        label={this.submitLabel()}
        icon='sign-in'
        onClick={this.onSubmit}
        onFailed={this.onFailed}
        onSuccess={this.onSuccess}
        params={this.txParams()}
        ref={this.button}
        tx={this.txMethod()}
      />
    );
  }

  protected renderCancelButton (): React.ReactNode {
    const { t } = this.props;

    return (
      <>
        <Button
          isNegative
          onClick={this.hideModal}
          label={t('Cancel')}
          icon='cancel'
        />
        <Button.Or />
      </>
    );
  }

  protected reset = (): void => {
    this.setState(
      this.defaultState
    );
  }

  protected showModal = (): void => {
    this.setState({
      isOpen: true
    });
  }

  protected hideModal = (): void => {
    const { onClose } = this.props;

    onClose && onClose();

    this.setState(
      this.defaultState
    );
  }
}
