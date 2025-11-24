// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UnappliedSlash } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedBy, ValidatorInfo } from '../types.js';

import React, { useCallback, useMemo } from 'react';

import { AddressSmall, Badge, Checkbox, Icon, Table } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useBlockTime, useDeriveAccountInfo, useStakingAsyncApis } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import MaxBadge from '../MaxBadge.js';
import { useTranslation } from '../translate.js';

interface Props {
  allSlashes?: [BN, UnappliedSlash[]][];
  canSelect: boolean;
  filterName: string;
  info: ValidatorInfo;
  isNominated: boolean;
  isSelected: boolean;
  nominatedBy?: NominatedBy[];
  toggleFavorite: (accountId: string) => void;
  toggleSelected: (accountId: string) => void;
}

function queryAddress (address: string, isStakingAsync: boolean): void {
  window.location.hash = `/${isStakingAsync ? 'staking-async' : 'staking'}/query/${address}`;
}

function Validator ({ allSlashes, canSelect, filterName, info: { accountId, bondOther, bondOwn, bondTotal, commissionPer, isBlocking, isElected, isFavorite, key, lastPayout, numNominators, rankOverall, stakedReturnCmp }, isNominated, isSelected, nominatedBy = [], toggleFavorite, toggleSelected }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, apiIdentity } = useApi();
  const { isStakingAsync } = useStakingAsyncApis();
  const accountInfo = useDeriveAccountInfo(accountId);
  const [,, time] = useBlockTime(lastPayout);

  const isVisible = useMemo(
    () => accountInfo
      ? checkVisibility(apiIdentity, key, accountInfo, filterName)
      : true,
    [accountInfo, apiIdentity, filterName, key]
  );

  const slashes = useMemo(
    () => (allSlashes || [])
      .map(([era, all]) => ({ era, slashes: all.filter(({ validator }) => validator.eq(accountId)) }))
      .filter(({ slashes }) => slashes.length),
    [allSlashes, accountId]
  );

  const _onQueryStats = useCallback(
    () => queryAddress(key, isStakingAsync),
    [isStakingAsync, key]
  );

  const _toggleSelected = useCallback(
    () => toggleSelected(key),
    [key, toggleSelected]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <tr>
      <Table.Column.Favorite
        address={key}
        isFavorite={isFavorite}
        toggle={toggleFavorite}
      />
      <td className='badge together'>
        {isNominated
          ? (
            <Badge
              color='green'
              icon='hand-paper'
            />
          )
          : <Badge color='transparent' />
        }
        {isElected
          ? (
            <Badge
              color='blue'
              icon='chevron-right'
            />
          )
          : <Badge color='transparent' />
        }
        <MaxBadge numNominators={numNominators || nominatedBy.length} />
        {isBlocking && (
          <Badge
            color='red'
            icon='user-slash'
          />
        )}
        {slashes.length !== 0 && (
          <Badge
            color='red'
            hover={t('Slashed in era {{eras}}', {
              replace: {
                eras: slashes.map(({ era }) => formatNumber(era)).join(', ')
              }
            })}
            icon='skull-crossbones'
          />
        )}
      </td>
      <td className='number'>{rankOverall !== 0 && formatNumber(rankOverall)}</td>
      <td className='address all'>
        <AddressSmall value={accountId} />
      </td>
      <td className='number media--1400'>
        {lastPayout && (
          api.consts.babe
            ? time.days
              ? time.days === 1
                ? t('yesterday')
                : t('{{days}} days', { replace: { days: time.days } })
              : t('recently')
            : formatNumber(lastPayout)
        )}
      </td>
      <td className='number media--1200 no-pad-right'>{numNominators || ''}</td>
      <td className='number media--1200 no-pad-left'>{nominatedBy.length || ''}</td>
      <td className='number media--1100'>{commissionPer.toFixed(2)}%</td>
      <td className='number together'>{!bondTotal.isZero() && <FormatBalance value={bondTotal} />}</td>
      <td className='number together media--900'>{!bondOwn.isZero() && <FormatBalance value={bondOwn} />}</td>
      <td className='number together media--1600'>{!bondOther.isZero() && <FormatBalance value={bondOther} />}</td>
      <td className='number together'>{(stakedReturnCmp > 0) && <>{stakedReturnCmp.toFixed(2)}%</>}</td>
      <td>
        {!isBlocking && (canSelect || isSelected) && (
          <Checkbox
            onChange={_toggleSelected}
            value={isSelected}
          />
        )}
      </td>
      <td>
        <Icon
          className='staking--stats highlight--color'
          icon='chart-line'
          onClick={_onQueryStats}
        />
      </td>
    </tr>
  );
}

export default React.memo(Validator);
