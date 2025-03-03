// Copyright 2017-2024 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveHeartbeatAuthor } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { SlashingSpans, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedBy as NominatedByType, ValidatorInfo } from '../../types.js';
import type { NominatorValue } from './types.js';

import React, { useMemo } from 'react';

import {AddressSmall, Badge, Button, Columar, Icon, LinkExternal, Table, Tag} from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall, useDeriveAccountInfo, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import Status from './Status.js';
import Voter from '../../models/voter'
import {useRemainingVotes} from '../../useRemainingVotes'
import {styled} from '@polkadot/react-components/styled'

const ValidatorStatus = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`

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
  // nominatedBy?: NominatedByType[];
  points?: string;
  recentlyOnline?: DeriveHeartbeatAuthor;
  toggleFavorite: (accountId: string) => void;
  validatorInfo?: ValidatorInfo;
  withIdentity?: boolean;
  onVoteSuccess: () => Promise<void>
}

interface StakingState {
  isChilled?: boolean;
  commission?: string;
  nominators?: NominatorValue[];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
}

function expandInfo ({ exposure, validatorPrefs, isChilled }: ValidatorInfo, minCommission?: BN): StakingState {
  let nominators: NominatorValue[] | undefined;
  let stakeTotal: BN | undefined;
  let stakeOther: BN | undefined;
  let stakeOwn: BN | undefined;

  if (exposure?.total) {
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
    // isChilled: commission && minCommission && commission.isZero() && commission.lt(minCommission),
    isChilled,
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

function Address ({ address, className = '', filterName, hasQueries, isElected, isFavorite, isMain, isPara, lastBlock, minCommission, points, recentlyOnline, toggleFavorite, validatorInfo, withIdentity, onVoteSuccess }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const { accountInfo, slashingSpans } = useAddressCalls(api, address, isMain);
  const [isToggleVote, toggleVote] = useToggle();
  const { data: remainingVotesData, refetch: refetchRemainingVotesData } = useRemainingVotes(validatorInfo)

  const { isChilled, nominators } = useMemo(
    () => validatorInfo
      ? expandInfo(validatorInfo, minCommission)
      : {},
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
            address={address}
            isChilled={isChilled}
            isElected={isElected}
            isMain={isMain}
            isPara={isPara}
            isRelay={!!(api.query.parasShared || api.query.shared)?.activeValidatorIndices}
            // nominators={isMain ? nominators : nominatedBy}
            nominators={nominators}
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
        <td>
          {validatorInfo?.referralId}
        </td>
        <td>
          {validatorInfo?.isValidating ? (
            <ValidatorStatus>
              <Badge
                color='green'
                icon='chevron-right'
              />
              {t('Active')}
            </ValidatorStatus>
          ) : validatorInfo?.isChilled ? (
            <ValidatorStatus>
              <Badge
                color='red'
                icon='chevron-right'
              />
              {t('Drop Out')}
            </ValidatorStatus>
          ) : (
            <ValidatorStatus>
              <Badge
                color='blue'
                icon='chevron-right'
              />
              {t('Waiting')}
            </ValidatorStatus>
          )}
        </td>
        <td className='number'>
          <FormatBalance
            value={validatorInfo?.totalNomination}
          />
        </td>
        {/*<td className='number'>*/}
        {/*  <FormatBalance*/}
        {/*    value={validatorInfo?.rewardPotBevmBalance || validatorInfo?.rewardPotGovBalance}*/}
        {/*  />*/}
        {/*</td>*/}
        <td className='number'>
          <FormatBalance
            format={[10, 'SATS']}
            value={validatorInfo?.rewardPotBtcBalance || validatorInfo?.rewardPotGasBalance}
          />
        </td>
        <td className='number'>
          {lastBlock}
        </td>
        <td>
          <Button
            className={'flex'}
            icon='sign-in-alt'
            label={t('Vote')}
            onClick={toggleVote}
          />
        </td>
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
                {isMain && validatorInfo?.selfBonded && validatorInfo?.selfBonded > 0 && (
                  <>
                    <h5>{t('own stake')}</h5>
                    <FormatBalance
                      value={validatorInfo?.selfBonded}
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
          <td />
          <td />
          <td />
          <td />
        </tr>
      )}
      {isToggleVote && (
        <Voter
          onClose={toggleVote}
          validatorId={validatorInfo?.account}
          onSuccess={onVoteSuccess}
          remainingVotesData={remainingVotesData}
        />
      )}
    </>
  );
}

export default React.memo(Address);
