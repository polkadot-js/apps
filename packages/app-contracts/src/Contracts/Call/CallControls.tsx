// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps, StringOrNull } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { Abi } from '@polkadot/api-contract';
import { Dropdown, InputAddress, InputBalance, InputNumber } from '@polkadot/react-components';
import { displayType } from '@polkadot/types';

import translate from '../../translate';
import Params from '../../Params';

export enum CallMode {
  Rpc,
  Tx
}

interface Props extends I18nProps {
  accountId: StringOrNull;
  contractAddress: StringOrNull;
  contractMethod: StringOrNull;
  contractAbi?: Abi | null;
  endowment: BN;
  gasLimit: BN;
  isBusy: boolean;
  mode: CallMode;
  onChangeAccountId: (accountId: StringOrNull) => void;
  onChangeContractAddress: (contractAddress: StringOrNull) => void;
  onChangeContractMethod: (contractMethod: StringOrNull) => void;
  onChangeEndowment: (endowment?: BN) => void;
  onChangeGasLimit: (gasLimit?: BN) => void;
  onChangeParams: (params: any[]) => void;
  params?: any[];
}

function getContractMethodOptions (contractAbi: Abi | null): any[] {
  return contractAbi
    ? Object.keys(contractAbi.messages).map((key): { key: string; text: string; value: string } => {
      const fn = contractAbi.messages[key];
      const type = fn.type ? `: ${displayType(fn.type)}` : '';
      const args = fn.args.map(({ name, type }): string => `${name}: ${displayType(type)}`);
      const text = `${key}(${args.join(', ')})${type}`;

      return {
        key,
        text,
        value: key
      };
    })
    : [];
}

function CallControls (props: Props): React.ReactElement<Props> | null {
  const { accountId, onChangeAccountId, contractAddress, onChangeContractAddress, contractAbi, contractMethod, onChangeContractMethod, endowment, onChangeEndowment, gasLimit, onChangeGasLimit, onChangeParams, mode, t } = props;

  if (!contractAddress || !contractAbi) {
    return null;
  }

  const isEndowmentValid = true;
  const isGasValid = gasLimit.gtn(0);

  return (
    <div className='contracts--CallControls'>
      <InputAddress
        defaultValue={accountId}
        help={t('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
        label={t('call from account')}
        onChange={onChangeAccountId}
        type='account'
        value={accountId}
      />
      <InputAddress
        help={t('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
        label={t('contract to use')}
        onChange={onChangeContractAddress}
        type='contract'
        value={contractAddress}
      />
      <Dropdown
        defaultValue={contractMethod}
        help={t('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
        isError={!contractMethod}
        label={t('message to send')}
        onChange={onChangeContractMethod}
        options={getContractMethodOptions(contractAbi)}
        style={{ fontFamily: 'monospace' }}
        value={contractMethod}
      />
      <Params
        onChange={onChangeParams}
        params={
          contractMethod && contractAbi && contractAbi.messages[contractMethod]
            ? contractAbi.messages[contractMethod].args
            : undefined
        }
      />
      {mode === CallMode.Tx && (
        <>
          <InputBalance
            help={t('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
            isError={!isEndowmentValid}
            label={t('value')}
            onChange={onChangeEndowment}
            value={endowment}
          />
          <InputNumber
            defaultValue={gasLimit}
            help={t('The maximum amount of gas that can be used by this deployment, if the code requires more, the deployment will fail.')}
            isError={!isGasValid}
            label={t('maximum gas allowed')}
            onChange={onChangeGasLimit}
            value={gasLimit}
          />
        </>
      )}
    </div>
  );
}

export default translate(CallControls);
