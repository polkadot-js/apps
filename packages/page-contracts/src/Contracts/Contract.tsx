// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { Option } from '@polkadot/types';
import type { BlockNumber, ContractInfo } from '@polkadot/types/interfaces';
import type { ContractLink } from './types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { ContractPromise } from '@polkadot/api-contract';
import { AddressInfo, AddressMini, Button, Forget } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall, useToggle } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { keyring } from '@polkadot/ui-keyring';
import { formatNumber, isFunction, isUndefined } from '@polkadot/util';

import Messages from '../shared/Messages';
import { useTranslation } from '../translate';

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
  const bestNumber = useBestNumber();
  const info = useCall<ContractInfo | null>(api.query.contracts.contractInfoOf, [contract.address], { transform: transformInfo });
  const [evictAt, setEvictAt] = useState<BlockNumber | null>(null);
  const [isForgetOpen, toggleIsForgetOpen] = useToggle();

  useEffect((): void => {
    if (info && isFunction(api.rpc.contracts?.rentProjection)) {
      api.rpc.contracts
        .rentProjection(contract.address)
        .then((value) => setEvictAt(value.unwrapOr(null)))
        .catch(() => undefined);
    }
  }, [api, contract, info]);

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
        status.message = t<string>('address forgotten');
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
      }

      toggleIsForgetOpen();
    },
    [contract.address, t, toggleIsForgetOpen]
  );

  return (
    <tr className={className}>
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
          withExtended={false}
        />
      </td>
      <td className='start together'>
        {!isUndefined(info) && (
          info
            ? info.type
            : t<string>('Not on-chain')
        )}
      </td>
      <td className='number together media--1100'>
        {bestNumber && (
          evictAt
            ? (
              <>
                <BlockToTime value={evictAt.sub(bestNumber)} />
                #{formatNumber(evictAt)}
              </>
            )
            : t<string>('None')
        )}
      </td>
      <td className='button'>
        <Button
          icon='trash'
          onClick={toggleIsForgetOpen}
        />
      </td>
    </tr>
  );
}

export default React.memo(styled(Contract)`
  td.top a+a {
    margin-left: 0.75rem;
  }
`);
