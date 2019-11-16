// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';

import React from 'react';
import { withApi } from '@polkadot/react-api';
import { AddressRow, Button, Input } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import ContractModal, { ContractModalProps, ContractModalState } from '../Modal';
import ValidateAddr from './ValidateAddr';

import translate from '../translate';

interface Props extends ContractModalProps, ApiProps, I18nProps {}

interface State extends ContractModalState {
  address?: string | null;
  isAddressValid: boolean;
}

class Add extends ContractModal<Props, State> {
  constructor (props: Props) {
    super(props);
    this.defaultState = {
      ...this.defaultState,
      address: null,
      name: 'New Contract',
      isAddressValid: false,
      isNameValid: true
    };
    this.state = this.defaultState;
    this.headerText = props.t('Add an existing contract');
  }

  public isContract = true;

  protected renderContent = (): React.ReactNode => {
    const { t } = this.props;
    const { address, isAddressValid, isBusy, name } = this.state;

    return (
      <AddressRow
        defaultName={name}
        isValid
        value={address || null}
      >
        <Input
          autoFocus
          help={t('The address for the deployed contract instance.')}
          isDisabled={isBusy}
          isError={!isAddressValid}
          label={t('contract address')}
          onChange={this.onChangeAddress}
          onEnter={this.submit}
          value={address || ''}
        />
        <ValidateAddr
          address={address}
          onChange={this.onValidateAddr}
        />
        {this.renderInputName()}
        {this.renderInputAbi()}
      </AddressRow>
    );
  }

  protected renderButtons = (): React.ReactNode => {
    const { t } = this.props;
    const { isAddressValid, isAbiValid, isNameValid } = this.state;
    const isValid = isNameValid && isAddressValid && isAbiValid;

    return (
      <Button.Group>
        {this.renderCancelButton()}
        <Button
          icon='save'
          isDisabled={!isValid}
          isPrimary
          label={t('Save')}
          onClick={this.onAdd}
          ref={this.button}
        />
      </Button.Group>
    );
  }

  private onChangeAddress = (address: string): void => {
    this.setState({ address, isAddressValid: false });
  }

  private onValidateAddr = (isAddressValid: boolean): void => {
    this.setState({ isAddressValid });
  }

  private onAdd = (): void => {
    const { api } = this.props;
    const status: Partial<ActionStatus> = { action: 'create' };
    const { address, abi, name, tags } = this.state;

    if (!address || !abi || !name) {
      return;
    }

    try {
      const json = {
        name,
        tags,
        contract: {
          abi,
          genesisHash: api.genesisHash.toHex()
        }
      };

      keyring.saveContract(address, json);

      status.account = address;
      status.status = address ? 'success' : 'error';
      status.message = 'contract added';

      this.onClose();
    } catch (error) {
      console.error(error);

      status.status = 'error';
      status.message = error.message;
    }
  }
}

export default translate(withApi(Add));
