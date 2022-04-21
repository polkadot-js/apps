// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';
import type { MembersMapEntry, Params } from './types';

import React, { useCallback } from 'react';

import { AddressMini, ExpanderScroll } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Join from './Join';
import usePoolInfo from './usePoolInfo';

interface Props {
  className?: string;
  members: MembersMapEntry[];
  ownAccounts?: string[];
  params: Params;
  poolId: BN;
}

function Pool ({ className, members, ownAccounts, params, poolId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const info = usePoolInfo(poolId);
  const rewardBalances = useCall<DeriveBalancesAll>(info && api.derive.balances.all, [info?.accountReward]);
  const renderMembers = useCallback(
    () => members.map(({ accountId, info }, count) => (
      <AddressMini
        balance={info.points}
        key={`${count}:${accountId}`}
        value={accountId}
        withBalance
        withShrink
      />
    )),
    [members]
  );

  if (!info) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(poolId)}</h1></td>
      <td className='start'>{info.metadata}</td>
      <td className='number'>{info.bonded.state.type}</td>
      <td className='number'><FormatBalance value={info.bonded.points} /></td>
      <td className='number media--1100'>{rewardBalances && <FormatBalance value={rewardBalances.freeBalance} />}</td>
      <td className='number'>
        {members && members.length !== 0 && (
          <ExpanderScroll
            empty={t<string>('No members')}
            renderChildren={renderMembers}
            summary={t<string>('Members ({{count}})', { replace: { count: members.length } })}
          />
        )}
      </td>
      <td className='button'>
        <Join
          isDisabled={!info.bonded.state.isOpen || !info.bonded.delegatorCounter.ltn(params.maxMembersPerPool)}
          ownAccounts={ownAccounts}
          params={params}
          poolId={poolId}
        />
      </td>
    </tr>
  );
}

export default React.memo(Pool);
