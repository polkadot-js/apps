// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIMethod } from '@polkadot/api-contract/types';
import { CallContract, I18nProps, StringOrNull } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { Abi } from '@polkadot/api-contract';
import { Dropdown, InputAddress, InputBalance, InputNumber } from '@polkadot/react-components';
import { displayType } from '@polkadot/types';

import translate from '../../translate';
import Params from '../../Params';
import { getContractForAddress } from '../util';

interface Props extends I18nProps {
  accountId: StringOrNull;
  callContract: CallContract;
  callMethod: number | null;
  endowment: BN;
  gasLimit: BN;
  isBusy: boolean;
  onChangeAccountId: (accountId: StringOrNull) => void;
  onChangeCallContract: (callContract: CallContract) => void;
  onChangeCallMethod: (callMethod: StringOrNull) => void;
  onChangeEndowment: (endowment?: BN) => void;
  onChangeGasLimit: (gasLimit?: BN) => void;
  onChangeParams: (params: any[]) => void;
  params?: any[];
}

function getContractMethodOptions (contractAbi: Abi | null): any[] {
  return contractAbi
    ? contractAbi.abi.contract.messages.map((message, messageIndex): { key: string; text: string; value: string } => {
      const key = message.name;
      const type =  message.returnType ? `: ${displayType(message.returnType)}` : '';
      const args = message.args.map(({ name, type }): string => `${name}: ${displayType(type)}`);
      const text = `${key}(${args.join(', ')})${type}`;

      return {
        key,
        text,
        value: `${messageIndex}`
      };
    })
    : [];
}

function CallControls (props: Props): React.ReactElement<Props> | null {
  const { accountId, callContract: { abi, address }, callMethod, isBusy, onChangeAccountId, onChangeCallContract, onChangeCallMethod, endowment, onChangeEndowment, gasLimit, onChangeGasLimit, onChangeParams, t } = props;
  if (!address || !abi) {
    return null;
  }

  const isEndowmentValid = true;
  const isGasValid = !!gasLimit && gasLimit.gtn(0);

  const _onChangeCallAddress = (callAddress: StringOrNull): void => {
    console.log('_onchangeCallAddress');
    onChangeCallContract && onChangeCallContract(getContractForAddress(callAddress));
  };

  return (
    <div className='contracts--CallControls'>
      <InputAddress
        defaultValue={accountId}
        help={t('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
        isDisabled={isBusy}
        label={t('call from account')}
        onChange={onChangeAccountId}
        type='account'
        value={accountId}
      />
      <InputAddress
        help={t('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
        isDisabled={isBusy}
        label={t('contract to use')}
        onChange={_onChangeCallAddress}
        type='contract'
        value={address}
      />
      <Dropdown
        defaultValue={`${callMethod}`}
        help={t('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
        isDisabled={isBusy}
        isError={callMethod === null}
        label={t('message to send')}
        onChange={onChangeCallMethod}
        options={getContractMethodOptions(abi)}
        style={{ fontFamily: 'monospace' }}
        value={`${callMethod}`}
      />
      <Params
        isDisabled={isBusy}
        onChange={onChangeParams}
        params={
          callMethod && abi && abi.messages[callMethod]
            ? abi.messages[callMethod].args
            : undefined
        }
      />
      <InputBalance
        help={t('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
        isDisabled={isBusy}
        isError={!isEndowmentValid}
        label={t('value')}
        onChange={onChangeEndowment}
        value={endowment}
      />
      <InputNumber
        defaultValue={gasLimit}
        help={t('The maximum amount of gas that can be used by this deployment, if the code requires more, the deployment will fail.')}
        isDisabled={isBusy}
        isError={!isGasValid}
        label={t('maximum gas allowed')}
        onChange={onChangeGasLimit}
        value={gasLimit}
      />
    </div>
  );
}

export default translate(CallControls);
