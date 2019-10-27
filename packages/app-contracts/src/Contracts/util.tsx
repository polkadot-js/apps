// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIFn, ContractABIMethod } from '@polkadot/api-contract/types';
import { CallContract, NullContract, StringOrNull } from '@polkadot/react-components/types';
import { CONTRACT_NULL } from '../constants';

import React from 'react';
import { ApiPromise } from '@polkadot/api';
import { PromiseContract as Contract } from '@polkadot/api-contract';
import { MessageSignature } from '@polkadot/react-components';
import { getContractAbi } from '@polkadot/react-components/util';

export function findCallMethod (callContract: Contract | null, callMethodIndex = 0): ContractABIMethod | null {
  const message = callContract && callContract.abi.abi.contract.messages[callMethodIndex];

  return message || null;
}

export function getContractMethodFn (callContract: Contract | null, callMethodIndex: number | null): ContractABIFn | null {
  const fn = callContract && callContract.abi && callMethodIndex !== null && callContract.abi.messages[callMethodIndex];

  return fn || null;
}

export function getContractForAddress (api: ApiPromise, address: StringOrNull): Contract | null {
  if (!address) {
    return null;
  } else {
    const abi = getContractAbi(address);
    return abi
      ? new Contract(api, abi, address)
      : null
  }
}

export function getCallMethodOptions (callContract: Contract | null): any[] {
  return callContract && callContract.abi
    ? callContract.abi.abi.contract.messages.map((message, messageIndex): { key: string; text: React.ReactNode; value: string } => {
      const key = message.name;

      return {
        key,
        text: (
          <MessageSignature message={message} />
        ),
        value: `${messageIndex}`
      };
    })
    : [];
}
