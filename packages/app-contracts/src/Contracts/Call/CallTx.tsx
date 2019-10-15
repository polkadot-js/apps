// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';
import { CallProps as Props } from './types';

import BN from 'bn.js';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Abi } from '@polkadot/api-contract';
import { Button, Modal, TxButton, TxComponent } from '@polkadot/react-components';
import { getContractAbi } from '@polkadot/react-components/util';
import { withApi, withMulti } from '@polkadot/react-api';

import CallControls, { CallMode } from './CallControls';

import translate from '../../translate';
import { GAS_LIMIT } from '../../constants';

interface State {
  accountId: StringOrNull;
  contractAddress: StringOrNull;
  contractAbi?: Abi | null;
  contractMethod: StringOrNull;
  endowment: BN;
  gasLimit: BN;
  isAddressValid: boolean;
  isBusy: boolean;
  params: any[];
}

class CallTx extends TxComponent<Props, State> {
  public defaultState: State = {
    accountId: null,
    contractAddress: null,
    contractMethod: null,
    endowment: new BN(0),
    gasLimit: new BN(GAS_LIMIT),
    isAddressValid: false,
    isBusy: false,
    params: []
  };

  public state: State = this.defaultState;

  public static getDerivedStateFromProps ({ contractAddress: propsAddress, contractMethod: propsMethod, isOpen }: Props, { contractAddress, contractMethod }: State): Pick<State, never> | null {
    if (!isOpen) {
      return {
        contractAddress: null,
        contractMethod: null,
        contractAbi: null,
        isAddressValid: false
      };
    }

    return {
      ...(
        !contractAddress
          ? {
            contractAddress: propsAddress,
            contractAbi: propsAddress ? getContractAbi(propsAddress) : null,
            isAddressValid: !!propsAddress
          }
          : {}
      ),
      ...(
        !contractMethod
          ? { contractMethod: propsMethod }
          : {}
      )
    };
  }

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
          {t('Call a contract')}
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

  public renderContent (): React.ReactNode {
    const { accountId, gasLimit, endowment, isBusy } = this.state;

    const [contractAddress, contractAbi, contractMethod] = this.getCallProps();

    if (!contractAddress || !contractAbi) {
      return null;
    }

    return (
      <CallControls
        mode={CallMode.Tx}
        accountId={accountId}
        contractAddress={contractAddress}
        contractMethod={contractMethod}
        endowment={endowment}
        gasLimit={gasLimit}
        isBusy={isBusy}
        onChangeAccountId={this.onChangeAccount}
        onChangeContractAddress={this.onChangeContractAddress}
        onChangeContractMethod={this.onChangeContractMethod}
        onChangeEndowment={this.onChangeEndowment}
        onChangeGasLimit={this.onChangeGasLimit}
        onChangeParams={this.onChangeParams}
      />
    )
  }

  private renderButtons (): React.ReactNode {
    const { api, t } = this.props;
    const { accountId, gasLimit, isAddressValid } = this.state;
    const isEndowValid = true; // !endowment.isZero();
    const isGasValid = !gasLimit.isZero();
    const isValid = !!accountId && isEndowValid && isGasValid && isAddressValid;

    return (
      <Button.Group>
        <Button
          icon='cancel'
          isNegative
          onClick={this.onClose}
          label={t('Cancel')}
        />
        <Button.Or />
        <TxButton
          accountId={accountId}
          icon='sign-in'
          isDisabled={!isValid}
          isPrimary
          label={t('Call')}
          onClick={this.toggleBusy}
          onFailed={this.toggleBusy}
          onSuccess={this.toggleBusy}
          params={this.constructCall}
          tx={api.tx.contracts ? 'contracts.call' : 'contract.call'}
          ref={this.button}
        />
      </Button.Group>
    );
  }

  private getCallProps = (): [string | null, Abi | null, string | null] => {
    let contractAddress;
    let contractAbi;
    let contractMethod;

    if (!this.state.contractAddress) {
      return [null, null, null];
    } else {
      contractAddress = this.state.contractAddress;
      contractAbi = this.state.contractAbi || getContractAbi(contractAddress);
      contractMethod = contractAbi && this.state.contractMethod && contractAbi.messages[this.state.contractMethod]
        ? this.state.contractMethod
        : (
          contractAbi
            ? Object.keys(contractAbi.messages)[0]
            : null
        );
    }

    return [
      contractAddress || null,
      contractAbi || null,
      contractMethod || null
    ];
  }

  private constructCall = (): any[] => {
    const {
      endowment, gasLimit, params
    } = this.state;

    const [contractAddress, contractAbi, contractMethod] = this.getCallProps();

    if (!contractAbi || !contractMethod) {
      return [];
    }

    return [contractAddress, endowment, gasLimit, contractAbi.messages[contractMethod](...params)];
  }

  private onChangeAccount = (accountId: string | null): void => {
    this.setState({ accountId });
  }

  private onChangeContractAddress = (contractAddress: string | null): void => {
    const contractAbi = getContractAbi(contractAddress);

    this.setState({ contractAddress, contractAbi, isAddressValid: !!contractAbi });
  }

  private onChangeEndowment = (endowment?: BN | null): void => {
    this.setState({ endowment: endowment || new BN(0) });
  }

  private onChangeGasLimit = (gasLimit?: BN | null): void => {
    this.setState({ gasLimit: gasLimit || new BN(GAS_LIMIT) });
  }

  private onChangeContractMethod = (contractMethod: string | null): void => {
    this.setState({ contractMethod, params: [] });
  }

  private onChangeParams = (params: any[]): void => {
    this.setState({ params });
  }

  private toggleBusy = (): void => {
    this.setState(({ isBusy }): Pick<State, never> => ({
      isBusy: !isBusy
    }));
  }

  private reset = (): void => {
    this.setState((state: State): Pick<State, never> => {
      if (!state.isBusy) {
        return {
          ...state,
          ...this.defaultState
        };
      }

      return {};
    });
  }

  private onClose = (): void => {
    const { onClose } = this.props;

    this.reset();
    onClose && onClose();
  }
}

export default withMulti(
  translate(withRouter(CallTx)),
  withApi
);
