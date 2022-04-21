// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress, DeriveStakingAccount, DeriveUnlocking } from '@polkadot/api-derive/types';
import type { PalletNominationPoolsDelegator, PalletNominationPoolsPoolRoles } from '@polkadot/types/lookup';
import type { PoolInfo } from '../../Pools/types';
import type { SortedTargets } from '../../types';

import React, { useCallback, useContext, useMemo } from 'react';

import { AddressSmall, Menu, Popup, StakingRedeemable, StakingUnbonding, StatusContext } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN, formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate';
import ListNominees from '../Account/ListNominees';
import Nominate from '../Account/Nominate';
import useSlashingSpans from '../useSlashingSpans';
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
  sessionProgress?: DeriveSessionProgress;
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

function calcUnbonding (accountId: string, stashId: string, { activeEra }: DeriveSessionProgress, { unbondingEras }: PalletNominationPoolsDelegator): { accountId: string, controllerId: string, redeemable: BN, stashId: string, unlocking: DeriveUnlocking[] } {
  const unlocking: DeriveUnlocking[] = [];
  const redeemable = new BN(0);

  for (const [era, value] of unbondingEras.entries()) {
    if (era.lte(activeEra)) {
      redeemable.iadd(value);
    } else {
      unlocking.push({ remainingEras: era.sub(activeEra), value });
    }
  }

  return {
    accountId,
    controllerId: accountId,
    redeemable,
    stashId,
    unlocking
  };
}

function Pool ({ accountId, className, info: { accountStash, bonded: { points, roles }, metadata, reward }, isFirst, poolId, rewardBalance, sessionProgress, stakingInfo, stashId, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const spanCount = useSlashingSpans(accountStash);
  const { queueExtrinsic } = useContext(StatusContext);
  const [isBondOpen, toggleBond] = useToggle();
  const [isNominateOpen, toggleNominate] = useToggle();
  const [isUnbondOpen, toggleUnbond] = useToggle();
  const accInfo = useAccountInfo(accountId, reward, points, rewardBalance);

  const bondedInfo = useMemo(
    () => sessionProgress && accInfo && accInfo.delegator.unbondingEras && !accInfo.delegator.unbondingEras.isEmpty
      ? calcUnbonding(accountId, accountStash, sessionProgress, accInfo.delegator)
      : null,
    [accInfo, accountId, accountStash, sessionProgress]
  );

  const claimPayout = useCallback(
    () => queueExtrinsic({
      accountId: accountId,
      extrinsic: api.tx.nominationPools.claimPayout()
    }),
    [api, accountId, queueExtrinsic]
  );

  const withdrawUnbonded = useCallback(
    () => queueExtrinsic({
      accountId,
      extrinsic: api.tx.nominationPools.withdrawUnbonded(accountId, spanCount)
    }),
    [api, accountId, spanCount, queueExtrinsic]
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
      <td className='number'>
        {accInfo && (
          <>
            {!accInfo.delegator.points.isZero() && <FormatBalance value={accInfo.delegator.points} />}
            {bondedInfo && <StakingUnbonding stakingInfo={bondedInfo} />}
            {bondedInfo && (
              <StakingRedeemable
                isPool
                stakingInfo={bondedInfo}
              />
            )}
          </>
        )}
      </td>
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
              <Menu.Divider />
              <Menu.Item
                isDisabled={!accInfo || accInfo.claimable.isZero()}
                label={t<string>('Withdraw claimable')}
                onClick={claimPayout}
              />
              <Menu.Item
                isDisabled={!bondedInfo || bondedInfo.redeemable.isZero()}
                label={t<string>('Withdraw unbonded')}
                onClick={withdrawUnbonded}
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
