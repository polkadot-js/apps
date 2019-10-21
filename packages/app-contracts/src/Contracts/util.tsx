// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIFn, ContractABIMethod } from '@polkadot/api-contract/types';
import { CallContract, NullContract, StringOrNull } from '@polkadot/react-components/types';
import { CONTRACT_NULL } from '../constants';

import React from 'react';
import { MessageSignature } from '@polkadot/react-components';
import { getContractAbi } from '@polkadot/react-components/util';
import { stringCamelCase } from '@polkadot/util';

export function findCallMethod (callContract: CallContract | null, callMethodIndex = 0): ContractABIMethod | null {
  const message = callContract && callContract.abi.abi.contract.messages[callMethodIndex];

  return message || null;
}

export function getContractMethodFn (callContract: CallContract | null, callMethod: ContractABIMethod | null): ContractABIFn | null {
  const fn = callContract && callContract.abi && callMethod && callContract.abi.messages[stringCamelCase(callMethod.name)];

  return fn || null;
}

export function getContractForAddress (address: StringOrNull): CallContract | NullContract {
  if (!address) {
    return CONTRACT_NULL;
  } else {
    const abi = getContractAbi(address);
    return abi
      ? {
        address,
        abi
      }
      : CONTRACT_NULL;
  }
}

export function getCallMethodOptions (callContract: CallContract | null): any[] {
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
