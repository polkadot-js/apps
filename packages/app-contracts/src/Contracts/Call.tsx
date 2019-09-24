// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { BareProps, I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Abi } from '@polkadot/api-contract';
import { Button, Dropdown, InputAddress, InputBalance, InputNumber, Modal, TxButton, TxComponent } from '@polkadot/react-components';
import { getContractAbi } from '@polkadot/react-components/util';
import { withApi, withMulti } from '@polkadot/react-api';

import translate from '../translate';
import Params from '../Params';

interface Props extends BareProps, I18nProps, ApiProps, RouteComponentProps<{}> {
  address: string | null;
  isOpen: boolean;
  method: string | null;
  onClose: () => void;
}

interface State {
  accountId: string | null;
  address: string | null;
  contractAbi?: Abi | null;
  endowment: BN;
  gasLimit: BN;
  isAddressValid: boolean;
  isBusy: boolean;
  method: string | null;
  params: any[];
}

class Call extends TxComponent<Props, State> {
  public defaultState: State = {
    address: null,
    accountId: null,
    endowment: new BN(0),
    gasLimit: new BN(0),
    method: null,
    isAddressValid: false,
    isBusy: false,
    params: []
  };

  public state: State = this.defaultState;

  public static getDerivedStateFromProps ({ address: propsAddress, method: propsMethod, isOpen }: Props, { address, method }: State): Pick<State, never> | null {
    if (!isOpen) {
      return {
        address: null,
        method: null,
        contractAbi: null,
        isAddressValid: false
      };
    }

    return {
      ...(
        !address
          ? {
            address: propsAddress,
            contractAbi: propsAddress ? getContractAbi(propsAddress) : null,
            isAddressValid: !!propsAddress
          }
          : {}
      ),
      ...(
        !method
          ? { method: propsMethod }
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
    const { t } = this.props;
    const { gasLimit } = this.state;

    const [address, contractAbi, method] = this.getCallProps();
    const isEndowValid = true;
    const isGasValid = !gasLimit.isZero();

    if (!address || !contractAbi) {
      return null;
    }

    const methodOptions = contractAbi
      ? Object.keys(contractAbi.messages).map((key): { key: string; text: string; value: string } => {
        const fn = contractAbi.messages[key];
        const type = fn.type ? `: ${fn.type}` : '';
        const args = fn.args.map(({ name, type }): string => `${name}: ${type}`);
        const text = `${key}(${args.join(', ')})${type}`;

        return {
          key,
          text,
          value: key
        };
      })
      : [];

    return (
      <div className='contracts--Call'>
        <InputAddress
          help={t('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
          label={t('call from account')}
          onChange={this.onChangeAccount}
          type='account'
        />
        <InputAddress
          help={t('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
          label={t('contract to use')}
          onChange={this.onChangeAddress}
          type='contract'
          value={address}
        />
        <Dropdown
          defaultValue={method}
          help={t('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
          isError={!method}
          label={t('message to send')}
          onChange={this.onChangeMethod}
          options={methodOptions}
          style={{ fontFamily: 'monospace' }}
          value={method}
        />
        <Params
          onChange={this.onChangeParams}
          onEnter={this.sendTx}
          params={
            method && contractAbi && contractAbi.messages[method]
              ? contractAbi.messages[method].args
              : undefined
          }
        />
        <InputBalance
          help={t('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
          isError={!isEndowValid}
          label={t('value')}
          onChange={this.onChangeEndowment}
        />
        <InputNumber
          help={t('The maximum amount of gas that can be used by this deployment, if the code requires more, the deployment will fail.')}
          isError={!isGasValid}
          label={t('maximum gas allowed')}
          onChange={this.onChangeGas}
          onEnter={this.sendTx}
        />
      </div>
    );
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
    let address;
    let contractAbi;
    let method;

    if (!this.state.address) {
      return [null, null, null];
    } else {
      address = this.state.address;
      contractAbi = this.state.contractAbi || getContractAbi(address);
      method = contractAbi && this.state.method && contractAbi.messages[this.state.method]
        ? this.state.method
        : (
          contractAbi
            ? Object.keys(contractAbi.messages)[0]
            : null
        );
    }

    return [
      address || null,
      contractAbi || null,
      method || null
    ];
  }

  private constructCall = (): any[] => {
    const {
      endowment, gasLimit, params
    } = this.state;

    const [address, contractAbi, method] = this.getCallProps();

    if (!contractAbi || !method) {
      return [];
    }

    return [address, endowment, gasLimit, contractAbi.messages[method](...params)];
  }

  private onChangeAccount = (accountId: string | null): void => {
    this.setState({ accountId });
  }

  private onChangeAddress = (address: string): void => {
    const contractAbi = getContractAbi(address);

    this.setState({ address, contractAbi, isAddressValid: !!contractAbi });
  }

  private onChangeEndowment = (endowment?: BN | null): void => {
    this.setState({ endowment: endowment || new BN(0) });
  }

  private onChangeGas = (gasLimit: BN | undefined): void => {
    this.setState({ gasLimit: gasLimit || new BN(0) });
  }

  private onChangeMethod = (method: string | null): void => {
    this.setState({ method, params: [] });
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
  translate(withRouter(Call)),
  withApi
);
