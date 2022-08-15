// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeatAuthor } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { Exposure, SlashingSpans, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedBy as NominatedByType, ValidatorInfo } from '../../types';
import type { NominatorValue } from './types';

import { Exposure as DarwiniaExposure } from '@darwinia/types';
import React, { useMemo } from 'react';

import { ApiPromise } from '@polkadot/api';
import { formatDarwiniaPower } from '@polkadot/app-staking/Query/util';
import { useTranslation } from '@polkadot/app-staking/translate';
import { AddressSmall, Icon, LinkExternal } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall, useDeriveAccountInfo } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import Favorite from './Favorite';
import NominatedBy from './NominatedBy';
import StakeOther from './StakeOther';
import Status from './Status';

interface Props {
  address: string;
  className?: string;
  filterName: string;
  hasQueries: boolean;
  isElected: boolean;
  isFavorite: boolean;
  isMain?: boolean;
  isPara?: boolean;
  lastBlock?: string;
  minCommission?: BN;
  nominatedBy?: NominatedByType[];
  points?: string;
  recentlyOnline?: DeriveHeartbeatAuthor;
  toggleFavorite: (accountId: string) => void;
  validatorInfo?: ValidatorInfo;
  withIdentity?: boolean;
}

interface StakingState {
  isChilled?: boolean;
  isDarwiniaPower?: boolean;
  commission?: string;
  nominators: NominatorValue[];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

function expandInfo ({ exposure, validatorPrefs }: ValidatorInfo, minCommission?: BN): StakingState {
  let nominators: NominatorValue[] = [];
  let stakeTotal: BN | undefined;
  let stakeOther: BN | undefined;
  let stakeOwn: BN | undefined;
  let isDarwiniaPower = false;

  if (exposure && exposure.has('ownRingBalance')) {
    const darwiniaExposure = exposure as DarwiniaExposure;

    nominators = darwiniaExposure.others.map(({ power, who }) => ({
      nominatorId: who.toString(),
      value: power
    }));
    stakeTotal = darwiniaExposure.totalPower || BN_ZERO;
    stakeOwn = darwiniaExposure.ownPower || BN_ZERO;
    stakeOther = stakeTotal.sub(stakeOwn);
    isDarwiniaPower = true;
  } else if (exposure && exposure.has('total')) {
    const polkadotExposure = exposure as Exposure;

    nominators = polkadotExposure.others.map(({ value, who }) => ({
      nominatorId: who.toString(),
      value: value.unwrap()
    }));
    stakeTotal = polkadotExposure.total?.unwrap() || BN_ZERO;
    stakeOwn = polkadotExposure.own.unwrap();
    stakeOther = stakeTotal.sub(stakeOwn);
  }

  const commission = (validatorPrefs as ValidatorPrefs)?.commission?.unwrap();

  return {
    commission: commission?.toHuman(),
    isChilled: commission && minCommission && commission.isZero() && commission.lt(minCommission),
    isDarwiniaPower,
    nominators,
    stakeOther,
    stakeOwn,
    stakeTotal
  };
}

const transformSlashes = {
  transform: (opt: Option<SlashingSpans>) => opt.unwrapOr(null)
};

function useAddressCalls (api: ApiPromise, address: string, isMain?: boolean) {
  const params = useMemo(() => [address], [address]);
  const accountInfo = useDeriveAccountInfo(address);
  const slashingSpans = useCall<SlashingSpans | null>(!isMain && api.query.staking.slashingSpans, params, transformSlashes);

  return { accountInfo, slashingSpans };
}

function Address ({ address, className = '', filterName, hasQueries, isElected, isFavorite, isMain, isPara, lastBlock, minCommission, nominatedBy, points, recentlyOnline, toggleFavorite, validatorInfo, withIdentity }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const { accountInfo, slashingSpans } = useAddressCalls(api, address, isMain);

  const { commission, isChilled, isDarwiniaPower, nominators, stakeOther, stakeOwn } = useMemo(
    () => validatorInfo
      ? expandInfo(validatorInfo, minCommission)
      : { nominators: [] },
    [minCommission, validatorInfo]
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
        <Status
          isChilled={isChilled}
          isElected={isElected}
          isMain={isMain}
          isPara={isPara}
          isRelay={!!(api.query.parasShared || api.query.shared)?.activeValidatorIndices}
          nominators={isMain ? nominators : nominatedBy}
          onlineCount={recentlyOnline?.blockCount}
          onlineMessage={recentlyOnline?.hasMessage}
        />
      </td>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      {isMain
        ? (
          <StakeOther
            isDarwiniaPower={isDarwiniaPower}
            nominators={nominators}
            stakeOther={stakeOther}
          />
        )
        : (
          <NominatedBy
            nominators={nominatedBy}
            slashingSpans={slashingSpans}
          />
        )
      }
      {isMain && (
        <td className='number media--1100'>
          {stakeOwn?.gtn(0) && (
            <FormatBalance
              isDarwiniaPower = {isDarwiniaPower}
              value={isDarwiniaPower ? undefined : stakeOwn}
              valueFormatted={isDarwiniaPower ? formatDarwiniaPower(stakeOwn, t('power', 'power')) : undefined}
            />
          )}
        </td>
      )}
      <td className='number'>
        {commission}
      </td>
      {isMain && (
        <>
          <td className='number'>
            {points}
          </td>
          <td className='number'>
            {lastBlock}
          </td>
        </>
      )}
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
          type={isMain ? 'validator' : 'intention'}
        />
      </td>
    </tr>
  );
}

export default React.memo(Address);
