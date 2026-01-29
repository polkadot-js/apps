// Copyright 2017-2025 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownItemProps } from 'semantic-ui-react';
import type { ApiPromise } from '@polkadot/api';
import type { AbiMessage } from '@polkadot/api-contract/types';

import React from 'react';

import { ContractPromise } from '@polkadot/api-contract';
import { getContractAbi } from '@polkadot/react-components/util';

import MessageSignature from '../shared/MessageSignature.js';

export function findCallMethod (callContract: ContractPromise | null, callMethodIndex = 0): AbiMessage | null {
  return callContract?.abi.messages[callMethodIndex] || null;
}

export function getContractMethodFn (callContract: ContractPromise | null, callMethodIndex: number | null): AbiMessage | null {
  const fn = callMethodIndex !== null && callContract?.abi?.messages[callMethodIndex];

  return fn || null;
}

export function getContractForAddress (api: ApiPromise, address: string | null): ContractPromise | null {
  if (!address) {
    return null;
  } else {
    const abi = getContractAbi(address);

    return abi
      ? new ContractPromise(api, abi, address)
      : null;
  }
}

export function getCallMessageOptions (callContract: ContractPromise | null): DropdownItemProps[] {
  return callContract?.abi.messages.map((m, index) => ({
    key: m.identifier,
    text: (
      <MessageSignature message={m} />
    ),
    value: index
  })) || [];
}
