// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { PalletNominationPoolsDelegator, PalletNominationPoolsPoolRoles } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PoolInfo } from '../../Pools/types';
import type { SortedTargets } from '../../types';

import React, { useMemo } from 'react';

import { AddressSmall, Menu, Popup } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate';
import ListNominees from '../Account/ListNominees';
import Nominate from '../Account/Nominate';
import BondExtra from './BondExtra';

interface Props {
  accountId: string;
  className?: string;
  info: PoolInfo;
  isFirst: boolean;
  poolId: BN;
  stakingInfo?: DeriveStakingAccount;
  stashId: string;
  targets: SortedTargets;
}

interface Roles {
  isNominator: boolean;
}

const OPT_DEL = {
  transform: (opt: Option<PalletNominationPoolsDelegator>): PalletNominationPoolsDelegator | null =>
    opt.unwrapOr(null)
};

function extractRoles (accountId: string, { nominator, root }: PalletNominationPoolsPoolRoles): Roles {
  return {
    isNominator: nominator.eq(accountId) || root.eq(accountId)
  };
}

function Pool ({ accountId, className, info: { bonded: { roles }, metadata }, isFirst, poolId, stakingInfo, stashId, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const accInfo = useCall(api.query.nominationPools.delegators, [accountId], OPT_DEL);
  const [isNominateOpen, toggleNominate] = useToggle();
  const [isBondOpen, toggleBond] = useToggle();

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
      <td className='number'>{accInfo && <FormatBalance value={accInfo.points} />}</td>
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
        <Popup
          key='settings'
          value={
            <Menu>
              <Menu.Item
                label={t<string>('Bond more funds')}
                onClick={toggleBond}
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
