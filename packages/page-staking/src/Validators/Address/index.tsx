// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { SlashingSpans, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedBy as NominatedByType, ValidatorInfo } from '../../types';
import type { NominatorValue } from './types';

import React, { useMemo } from 'react';

import { ApiPromise } from '@polkadot/api';
import { AddressSmall, Icon, LinkExternal } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall, useDeriveAccountInfo } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import Favorite from './Favorite';
import NominatedBy from './NominatedBy';
import StakeOther from './StakeOther';

interface Props {
  address: string;
  className?: string;
  filterName: string;
  hasQueries: boolean;
  isFavorite: boolean;
  nominatedBy?: NominatedByType[];
  toggleFavorite: (accountId: string) => void;
  validatorInfo?: ValidatorInfo;
  withIdentity?: boolean;
}

interface StakingState {
  commission?: string;
  nominators: NominatorValue[];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

function expandInfo ({ exposure, validatorPrefs }: ValidatorInfo): StakingState {
  let nominators: NominatorValue[] = [];
  let stakeTotal: BN | undefined;
  let stakeOther: BN | undefined;
  let stakeOwn: BN | undefined;

  if (exposure && exposure.total) {
    nominators = exposure.others.map(({ value, who }) => ({
      nominatorId: who.toString(),
      value: value.unwrap()
    }));
    stakeTotal = exposure.total?.unwrap() || BN_ZERO;
    stakeOwn = exposure.own.unwrap();
    stakeOther = stakeTotal.sub(stakeOwn);
  }

  const commission = (validatorPrefs as ValidatorPrefs)?.commission?.unwrap();

  return {
    commission: commission?.toHuman(),
    nominators,
    stakeOther,
    stakeOwn,
    stakeTotal
  };
}

const transformSlashes = {
  transform: (opt: Option<SlashingSpans>) => opt.unwrapOr(null)
};

function useAddressCalls (api: ApiPromise, address: string) {
  const params = useMemo(() => [address], [address]);
  const accountInfo = useDeriveAccountInfo(address);
  const slashingSpans = useCall<SlashingSpans | null>(api.query.staking.slashingSpans, params, transformSlashes);

  return { accountInfo, slashingSpans };
}

function Address ({ address, className = '', filterName, hasQueries, isFavorite, nominatedBy, toggleFavorite, validatorInfo, withIdentity }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { accountInfo, slashingSpans } = useAddressCalls(api, address);

  const { commission, nominators, stakeOther, stakeOwn } = useMemo(
    () => validatorInfo
      ? expandInfo(validatorInfo)
      : { nominators: [] },
    [validatorInfo]
  );

  const isVisible = useMemo(
    () => accountInfo ? checkVisibility(api, address, accountInfo, filterName, withIdentity) : true,
    [api, accountInfo, address, filterName, withIdentity]
  );

  const statsLink = useMemo(
    () => `#/staking/query/${address}`,
    [address]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='badge together'>
        <Favorite
          address={address}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
      </td>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      <StakeOther
        nominators={nominators}
        stakeOther={stakeOther}
      />
      <td className='number media--1100'>
        {stakeOwn?.gtn(0) && (
          <FormatBalance value={stakeOwn} />
        )}
      </td>
      <NominatedBy
        nominators={nominatedBy}
        slashingSpans={slashingSpans}
      />
      <td className='number'>
        {commission}
      </td>
      <td>
        {hasQueries && (
          <a href={statsLink}>
            <Icon
              className='highlight--color'
              icon='chart-line'
            />
          </a>
        )}
      </td>
      <td className='links media--1200'>
        <LinkExternal
          data={address}
          type={'validator'}
        />
      </td>
    </tr>
  );
}

export default React.memo(Address);
