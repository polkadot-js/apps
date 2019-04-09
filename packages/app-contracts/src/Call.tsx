// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import { Dropdown } from '@polkadot/ui-app';
import { ContractAbi } from '@polkadot/types';

import store from './store';
import translate from './translate';
import Params from './Params';

type Props = ComponentProps & I18nProps;

type State = {
  address?: string,
  contractAbi?: ContractAbi | null,
  isAddressValid: boolean,
  method?: string,
  params: Array<any>
};

class Call extends React.PureComponent<Props> {
  state: State = {
    isAddressValid: false,
    params: []
  };

  render () {
    const { t } = this.props;
    const { address, contractAbi, isAddressValid, method } = this.state;
    const contractOptions = store.getAllContracts().map(({ json: { address, name } }) => ({
      text: `${name} (${address})`,
      value: address
    }));
    const methodOptions = method && contractAbi
      ? Object
        .keys(contractAbi.messages)
        .map((name) => {
          const fn = contractAbi.messages[name];
          const text = `${name}(${fn.args.map(({ name, type }) => name + ': ' + type).join(', ')})${fn.type ? ': ' : ''}${fn.type ? fn.type : ''}`;

          return {
            key: text,
            text,
            value: method
          };
        })
      : [];
    const defaultContract = contractOptions.length
      ? contractOptions[contractOptions.length - 1].value
      : undefined;

    return (
      <div className='contracts--Call'>
        <Dropdown
          defaultValue={defaultContract}
          help={t('A deployed contract that has either beein deployed or attached. The address and ABI are used to construct the parameters.')}
          isError={!isAddressValid}
          label={t('Contract to use')}
          onChange={this.onChangeAddress}
          options={contractOptions}
          value={address}
        />
        <Dropdown
          defaultValue={method}
          help={t('The message to call on this contract. Parameters are adjusted based on the ABI provided.')}
          isError={!method}
          label={t('Message to send')}
          onChange={this.onChangeMethod}
          options={methodOptions}
          value={method}
        />
        <Params
          onChange={this.onChangeParams}
          params={
            method && contractAbi && contractAbi.messages[method]
              ? contractAbi.messages[method].args
              : undefined
          }
        />
      </div>
    );
  }

  private onChangeAddress = (address: string): void => {
    const contract = store.getContract(address);
    const contractAbi = contract
    ? contract.contractAbi
    : null;

    this.setState({ address, contractAbi, isAddressValid: !!contractAbi });
    this.onChangeMethod(
      contractAbi
        ? Object.keys(contractAbi.messages)[0]
        : null
    );
  }

  private onChangeMethod = (method: string | null): void => {
    this.setState({ method });
  }

  private onChangeParams = (params: Array<any>): void => {
    this.setState({ params });
  }
}

export default translate(Call);
