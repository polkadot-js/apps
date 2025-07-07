// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveHeartbeatAuthor } from '@polkadot/api-derive/types';
import type { NominatedBy as NominatedByType, ValidatorInfo } from '@polkadot/app-staking/types';
import type { Option } from '@polkadot/types';
import type { SlashingSpans, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatorValue } from './types.js';

import React, { useMemo } from 'react';

import { AddressSmall, Columar, Icon, LinkExternal, Table, Tag } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall, useDeriveAccountInfo, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import NominatedBy from './NominatedBy.js';
import StakeOther from './StakeOther.js';
import Status from './Status.js';

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
  nominators?: NominatorValue[];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

function expandInfo ({ exposureMeta, exposurePaged, validatorPrefs }: ValidatorInfo, minCommission?: BN): StakingState {
  let nominators: NominatorValue[] | undefined;
  let stakeTotal: BN | undefined;
  let stakeOther: BN | undefined;
  let stakeOwn: BN | undefined;

  if (exposureMeta?.total) {
    nominators = exposurePaged.others.map(({ value, who }) => ({
      nominatorId: who.toString(),
      value: value.unwrap()
    }));
    stakeTotal = exposureMeta.total?.unwrap() || BN_ZERO;
    stakeOwn = exposureMeta.own.unwrap();
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
  const { api, apiIdentity } = useApi();
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const { accountInfo, slashingSpans } = useAddressCalls(api, address, isMain);

  const { commission, isChilled, nominators, stakeOther, stakeOwn } = useMemo(
    () => validatorInfo
      ? expandInfo(validatorInfo, minCommission)
      : {},
    [minCommission, validatorInfo]
  );

  const isVisible = useMemo(
    () => accountInfo ? checkVisibility(apiIdentity, address, accountInfo, filterName, withIdentity) : true,
    [accountInfo, address, filterName, apiIdentity, withIdentity]
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
      <tr className={`${className} isExpanded isFirst ${isExpanded ? 'packedBottom' : 'isLast'}`}>
        <Table.Column.Favorite
          address={address}
          isFavorite={isFavorite}
          toggle={toggleFavorite}
        />
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
        <td className='address all relative'>
          <AddressSmall value={address} />
          {isMain && pointsAnimClass && (
            <Tag
              className={`${pointsAnimClass} absolute`}
              color='lightgrey'
              label={points}
            />
          )}
        </td>
        {isMain
          ? (
            <StakeOther
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
        <td className='number'>
          {commission || <span className='--tmp'>50.00%</span>}
        </td>
        {isMain && (
          <td className='number'>
            {lastBlock}
          </td>
        )}
        <Table.Column.Expand
          isExpanded={isExpanded}
          toggle={toggleIsExpanded}
        />
      </tr>
      {isExpanded && (
        <tr className={`${className} ${isExpanded ? 'isExpanded isLast' : 'isCollapsed'} packedTop`}>
          <td colSpan={2} />
          <td
            className='columar'
            colSpan={
              isMain
                ? 4
                : 3
            }
          >
            <Columar size='small'>
              <Columar.Column>
                {isMain && stakeOwn?.gtn(0) && (
                  <>
                    <h5>{t('own stake')}</h5>
                    <FormatBalance
                      value={stakeOwn}
                    />
                  </>
                )}
              </Columar.Column>
              <Columar.Column>
                {hasQueries && (
                  <>
                    <h5>{t('graphs')}</h5>
                    <a href={statsLink}>
                      <Icon
                        className='highlight--color'
                        icon='chart-line'
                      />
                      &nbsp;{t('historic results')}
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
      )}
    </>
  );
}

export default React.memo(Address);
