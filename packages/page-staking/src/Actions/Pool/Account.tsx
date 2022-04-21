// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { PalletNominationPoolsPoolRoles } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PoolInfo } from '../../Pools/types';
import type { SortedTargets } from '../../types';

import React, { useCallback, useContext, useMemo } from 'react';

import { AddressSmall, Menu, Popup, StatusContext } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate';
import ListNominees from '../Account/ListNominees';
import Nominate from '../Account/Nominate';
import BondExtra from './BondExtra';
import Unbond from './Unbond';
import useAccountInfo from './useAccountInfo';

interface Props {
  accountId: string;
  className?: string;
  info: PoolInfo;
  isFirst: boolean;
  poolId: BN;
  rewardBalance?: BN;
  stakingInfo?: DeriveStakingAccount;
  stashId: string;
  targets: SortedTargets;
}

interface Roles {
  isNominator: boolean;
}

function extractRoles (accountId: string, { nominator, root }: PalletNominationPoolsPoolRoles): Roles {
  return {
    isNominator: nominator.eq(accountId) || root.eq(accountId)
  };
}

function Pool ({ accountId, className, info: { bonded: { points, roles }, metadata, reward }, isFirst, poolId, rewardBalance, stakingInfo, stashId, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { queueExtrinsic } = useContext(StatusContext);
  const [isBondOpen, toggleBond] = useToggle();
  const [isNominateOpen, toggleNominate] = useToggle();
  const [isUnbondOpen, toggleUnbond] = useToggle();
  const accInfo = useAccountInfo(accountId, reward, points, rewardBalance);

  const claimPayout = useCallback(
    () => queueExtrinsic({
      accountId: accountId,
      extrinsic: api.tx.nominationPools.claimPayout()
    }),
    [api, accountId, queueExtrinsic]
  );

  const { isNominator } = useMemo(
    () => extractRoles(accountId, roles),
    [accountId, roles]
  );

  const nominating = useMemo(
    () => stakingInfo && stakingInfo.nominators.map((n) => n.toString()),
    [stakingInfo]
  );

  return (
    <tr className={className}>
      <td className='number'><h1>{isFirst && formatNumber(poolId)}</h1></td>
      <td className='start'>{isFirst && metadata}</td>
      <td className='address'><AddressSmall value={accountId} /></td>
      <td className='number'>{accInfo && <FormatBalance value={accInfo.delegator.points} />}</td>
      <td className='number'>{accInfo && !accInfo.claimable.isZero() && <FormatBalance value={accInfo.claimable} />}</td>
      <td className='number'>
        {isFirst && nominating && (
          <ListNominees
            nominating={nominating}
            stashId={stashId}
          />
        )}
      </td>
      <td className='button'>
        {isBondOpen && (
          <BondExtra
            controllerId={accountId}
            onClose={toggleBond}
            poolId={poolId}
          />
        )}
        {isNominateOpen && (
          <Nominate
            controllerId={accountId}
            nominating={nominating}
            onClose={toggleNominate}
            poolId={poolId}
            stashId={accountId}
            targets={targets}
          />
        )}
        {accInfo && isUnbondOpen && (
          <Unbond
            controllerId={accountId}
            maxUnbond={accInfo.delegator.points}
            onClose={toggleUnbond}
            poolId={poolId}
          />
        )}
        <Popup
          key='settings'
          value={
            <Menu>
              <Menu.Item
                label={t<string>('Bond more funds')}
                onClick={toggleBond}
              />
              <Menu.Item
                isDisabled={!accInfo || accInfo.delegator.points.isZero()}
                label={t<string>('Unbond funds')}
                onClick={toggleUnbond}
              />
              <Menu.Item
                isDisabled={!accInfo || accInfo.claimable.isZero()}
                label={t<string>('Withdraw payout')}
                onClick={claimPayout}
              />
              <Menu.Divider />
              <Menu.Item
                isDisabled={!isNominator}
                label={t<string>('Set nominees')}
                onClick={toggleNominate}
              />
            </Menu>
          }
        />
      </td>
    </tr>
  );
}

export default React.memo(Pool);
