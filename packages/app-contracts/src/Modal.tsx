// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { Abi } from '@polkadot/api-contract';
import { Button, Input, InputAddress, InputNumber, Modal, TxComponent } from '@polkadot/react-components';

import ABI from './ABI';

export interface ContractModalProps extends I18nProps {
  basePath: string;
  isNew?: boolean;
  isOpen: boolean;
  onClose?: () => void;
}

export interface ContractModalState {
  abi?: string | null;
  accountId?: string | null;
  contractAbi?: Abi | null;
  gasLimit: BN;
  isAbiSupplied: boolean;
  isAbiValid: boolean;
  isBusy: boolean;
  isNameValid: boolean;
  name?: string | null;
  tags: string[];
}

class ContractModal<P extends ContractModalProps, S extends ContractModalState> extends TxComponent<P, S> {
  // horrible :(
  protected defaultState: S = {
    accountId: null,
    gasLimit: new BN(0),
    isAbiSupplied: false,
    isAbiValid: false,
    isBusy: false,
    isNameValid: false,
    name: null,
    tags: [] as string[]
  } as S;

  public state: S = this.defaultState;

  protected isContract?: boolean;

  public render (): React.ReactNode {
    const { isOpen, t } = this.props;

    return (
      <Modal
        className='app--contracts-Modal'
        dimmer='inverted'
        onClose={this.onClose}
        open={isOpen}
      >
        <Modal.Header>
          {t(this.headerText)}
        </Modal.Header>
        <Modal.Content>
          {this.renderContent()}
        </Modal.Content>
        <Modal.Actions>
          {this.renderButtons()}
        </Modal.Actions>
      </Modal>
    );
  }

  protected headerText = '';

  protected renderContent: () => React.ReactNode | null = (): React.ReactNode => null;

  protected renderButtons: () => React.ReactNode | null = (): React.ReactNode => null;

  protected renderInputAbi (): React.ReactNode {
    const { t } = this.props;
    const { isBusy } = this.state;

    return (
      <ABI
        help={t(
          this.isContract
            ? 'The ABI for the WASM code. Since we will be making a call into the code, the ABI is required and stored for future operations such as sending messages.'
            : 'The ABI for the WASM code. In this step it is optional, but setting it here simplifies the setup of contract instances.'
        )}
        label={t(
          this.isContract
            ? 'contract ABI'
            : 'contract ABI (optional)'
        )}
        onChange={this.onAddAbi}
        isDisabled={isBusy}
        isRequired={this.isContract}
      />
    );
  }

  protected renderInputAccount (): React.ReactNode {
    const { t } = this.props;
    const { accountId, isBusy } = this.state;

    return (
      <InputAddress
        help={t('Specify the user account to use for this deployment. And fees will be deducted from this account.')}
        isDisabled={isBusy}
        isInput={false}
        label={t('deployment account')}
        onChange={this.onChangeAccount}
        type='account'
        value={accountId}
      />
    );
  }

  protected renderInputName (): React.ReactNode {
    const { isNew, t } = this.props;
    const { isBusy, isNameValid, name } = this.state;

    return (
      <Input
        help={t(
          this.isContract
            ? 'A name for the deployed contract to help users distinguish. Only used for display purposes.'
            : 'A name for this WASM code to help users distinguish. Only used for display purposes.'
        )}
        isDisabled={isBusy}
        isError={!isNameValid}
        label={t(
          this.isContract
            ? 'contract name'
            : 'code bundle name'
        )}
        onChange={this.onChangeName}
        onEnter={this[isNew ? 'sendTx' : 'submit']}
        value={name || ''}
      />
    );
  }

  protected renderInputGas (): React.ReactNode {
    const { t } = this.props;
    const { gasLimit, isBusy } = this.state;
    const isGasValid = !gasLimit.isZero();

    return (
      <InputNumber
        help={t('The maximum amount of gas that can be used by this deployment, if the code requires more, the deployment will fail.')}
        isDisabled={isBusy}
        isError={!isGasValid}
        label={t('maximum gas allowed')}
        onChange={this.onChangeGas}
        onEnter={this.sendTx}
        value={gasLimit || ''}
      />
    );
  }

  protected renderCancelButton (): React.ReactNode {
    const { t } = this.props;

    return (
      <>
        <Button
          icon='cancel'
          isNegative
          onClick={this.onClose}
          label={t('Cancel')}
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

  protected toggleBusy = (isBusy?: boolean): () => void =>
    (): void => {
      this.setState((state: S): S => {
        return {
          isBusy: isBusy === undefined ? !state.isBusy : isBusy
        } as unknown as S;
      });
    }

  protected onClose = (): void => {
    const { onClose } = this.props;
    const { isBusy } = this.state;

    onClose && onClose();
    if (!isBusy) {
      this.reset();
    }
  }

  protected onAddAbi = (abi: string | null | undefined, contractAbi: Abi | null = null, isAbiSupplied = false): void => {
    this.setState({ abi, contractAbi, isAbiSupplied, isAbiValid: !!abi });
  }

  protected onChangeAccount = (accountId: string | null): void => {
    this.setState({ accountId });
  }

  protected onChangeName = (name: string): void => {
    this.setState({ name, isNameValid: name.length !== 0 });
  }

  protected onChangeGas = (gasLimit: BN | undefined): void => {
    this.setState({ gasLimit: gasLimit || new BN(0) });
  }
}

export default ContractModal;
