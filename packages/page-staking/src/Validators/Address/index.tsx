// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeatAuthor } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { SlashingSpans, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedBy as NominatedByType, ValidatorInfo } from '../../types';
import type { NominatorValue } from './types';

import React, { useMemo } from 'react';

import { ApiPromise } from '@polkadot/api';
import { AddressSmall, Columar, Icon, LinkExternal, Table, Tag } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall, useDeriveAccountInfo, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';
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
  commission?: string;
  nominators: NominatorValue[];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

function expandInfo ({ bondOwn, bondTotal, exposure, validatorPrefs }: ValidatorInfo, minCommission?: BN, isMain?: boolean): StakingState {
  let nominators: NominatorValue[] = [];
  let stakeOther: BN | undefined;
  let stakeOwn: BN = bondOwn;
  let stakeTotal: BN = bondTotal;

  if (isMain && exposure && exposure.total) {
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
    isChilled: commission && minCommission && commission.isZero() && commission.lt(minCommission),
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
  const { t } = useTranslation();
  const { api } = useApi();
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const { accountInfo, slashingSpans } = useAddressCalls(api, address, isMain);

  const { commission, isChilled, nominators, stakeOther, stakeOwn, stakeTotal } = useMemo(
    () => validatorInfo
      ? expandInfo(validatorInfo, minCommission, isMain)
      : { nominators: [] },
    [isMain, minCommission, validatorInfo]
  );

  const isVisible = useMemo(
    () => accountInfo ? checkVisibility(api, address, accountInfo, filterName, withIdentity) : true,
    [api, accountInfo, address, filterName, withIdentity]
  );

  const statsLink = useMemo(
    () => `#/staking/query/${address}`,
    [address]
  );

  const pointsAnimClass = useMemo(
    () => points && `greyAnim-${Date.now() % 25}`,
    [points]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <tr className={`${className} packedBottom`}>
        <Table.Column.Favorite
          address={address}
          isFavorite={isFavorite}
          toggle={toggleFavorite}
        />
        <td
          className='address all relative'
          colSpan={2}
        >
          <AddressSmall value={address} />
          {isMain && pointsAnimClass && (
            <Tag
              className={`${pointsAnimClass} absolute`}
              color='lightgrey'
              label={points}
            />
          )}
        </td>
        <Table.Column.Expand
          isExpanded={isExpanded}
          toggle={toggleIsExpanded}
        />
      </tr>
      <tr className={`${className} isExpanded ${isExpanded ? 'packedBottom' : ''}`}>
        <td />
        <td className='badge together'>
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
        <td className='number'>
          <FormatBalance value={stakeTotal} />
        </td>
        <td />
      </tr>
      {isExpanded && (
        <>
          <tr className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'} ${isMain ? 'packedBottom' : ''}`}>
            <td />
            <td className='number all'>
              <h5>{t<string>('own stake')}</h5>
            </td>
            <td className='number top'>
              <FormatBalance value={stakeOwn} />
            </td>
            <td />
          </tr>
          {isMain
            ? (
              <StakeOther
                className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'}`}
                nominators={nominators}
                stakeOther={stakeOther}
              />
            )
            : (
              <NominatedBy
                className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'}`}
                nominators={nominatedBy}
                slashingSpans={slashingSpans}
              />
            )
          }
          <tr className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'} packedTop`}>
            <td />
            <td
              className='columar'
              colSpan={2}
            >
              <Columar size='small'>
                <Columar.Column>
                  {commission && (
                    <>
                      <h5>{t<string>('commission')}</h5>
                      {commission}
                    </>
                  )}
                </Columar.Column>
                <Columar.Column>
                  {isMain && (
                    lastBlock && (
                      <>
                        <h5>{t<string>('last block')}</h5>
                        #{lastBlock}
                      </>
                    )
                  )}
                  {hasQueries && (
                    <>
                      <h5>{t<string>('graphs')}</h5>
                      <a href={statsLink}>
                        <Icon
                          className='highlight--color'
                          icon='chart-line'
                        />
                        &nbsp;{t<string>('historic results')}
                      </a>
                    </>
                  )}
                </Columar.Column>
              </Columar>
              <Columar is100>
                <Columar.Column>
                  <LinkExternal
                    data={address}
                    type='validator' // {isMain ? 'validator' : 'intention'}
                    withTitle
                  />
                </Columar.Column>
              </Columar>
            </td>
            <td />
          </tr>
        </>
      )}
    </>
  );
}

export default React.memo(Address);
