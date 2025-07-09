// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { Option } from '@polkadot/types';
import type { ContractInfo } from '@polkadot/types/interfaces';
import type { ContractLink } from './types.js';

import React, { useCallback } from 'react';

import { AddressInfo, AddressMini, Button, Forget, styled } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { isUndefined } from '@polkadot/util';

import Messages from '../shared/Messages.js';
import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  contract: ContractPromise;
  index: number;
  links?: ContractLink[];
  onCall: (contractIndex: number, messaeIndex: number, resultCb: (messageIndex: number, result?: ContractCallOutcome) => void) => void;
}

function transformInfo (optInfo: Option<ContractInfo>): ContractInfo | null {
  return optInfo.unwrapOr(null);
}

function Contract ({ className, contract, index, links, onCall }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const info = useCall<ContractInfo | null>(api.query.contracts.contractInfoOf, [contract.address], { transform: transformInfo });
  const [isForgetOpen, toggleIsForgetOpen] = useToggle();

  const _onCall = useCallback(
    (messageIndex: number, resultCb: (messageIndex: number, result?: ContractCallOutcome) => void) =>
      onCall(index, messageIndex, resultCb),
    [index, onCall]
  );

  const _onForget = useCallback(
    (): void => {
      const status: Partial<ActionStatus> = {
        account: contract.address,
        action: 'forget'
      };

      try {
        keyring.forgetContract(contract.address.toString());
        status.status = 'success';
        status.message = t('address forgotten');
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
      }

      toggleIsForgetOpen();
    },
    [contract.address, t, toggleIsForgetOpen]
  );

  return (
    <StyledTr className={className}>
      <td className='address top'>
        {isForgetOpen && (
          <Forget
            address={contract.address.toString()}
            key='modal-forget-contract'
            mode='contract'
            onClose={toggleIsForgetOpen}
            onForget={_onForget}
          />
        )}
        <AddressMini value={contract.address} />
      </td>
      <td className='all top'>
        <Messages
          contract={contract}
          contractAbi={contract.abi}
          isWatching
          onSelect={_onCall}
          trigger={links?.length}
          withMessages
        />
      </td>
      <td className='top'>
        {links?.map(({ blockHash, blockNumber }, index): React.ReactNode => (
          <a
            href={`#/explorer/query/${blockHash}`}
            key={`${index}-${blockNumber}`}
          >#{blockNumber}</a>
        ))}
      </td>
      <td className='number'>
        <AddressInfo
          address={contract.address}
          withBalance
          withBalanceToggle
        />
      </td>
      <td className='start together'>
        {!isUndefined(info) && (
          info
            ? info.type
            : t('Not on-chain')
        )}
      </td>
      <td className='button'>
        <Button
          icon='trash'
          onClick={toggleIsForgetOpen}
        />
      </td>
    </StyledTr>
  );
}

const StyledTr = styled.tr`
  td.top a+a {
    margin-left: 0.75rem;
  }
`;

export default React.memo(Contract);
