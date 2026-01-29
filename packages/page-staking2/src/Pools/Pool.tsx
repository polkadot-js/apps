// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { MembersMapEntry, Params } from './types.js';

import React, { useCallback } from 'react';

import { AddressMini, ExpandButton, ExpanderScroll, Spinner, styled, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate.js';
import Join from './Join.js';
import usePoolInfo from './usePoolInfo.js';

interface Props {
  className?: string;
  members: MembersMapEntry[];
  ownAccounts?: string[];
  params: Params;
  poolId: BN;
}

function Pool ({ className = '', members, ownAccounts, params, poolId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const info = usePoolInfo(poolId);
  const [isExpanded, toggleExpanded] = useToggle(false);

  const renderMembers = useCallback(
    () => members.map(({ accountId, member }, count): React.ReactNode => (
      <AddressMini
        balance={member.points}
        key={`${count}:${accountId}`}
        value={accountId}
        withBalance
        withShrink
      />
    )),
    [members]
  );

  const renderNominees = useCallback(
    () => info?.nominating.map((stashId, count): React.ReactNode => (
      <AddressMini
        key={`${count}:${stashId}`}
        value={stashId}
        withShrink
      />
    )),
    [info]
  );

  return (
    <>
      <StyledTr className={`${className} isFirst isExpanded ${isExpanded ? '' : 'isLast'}`}>
        <Table.Column.Id value={poolId} />
        <td className='start'>
          <div className={`${isExpanded ? '' : 'clamp'}`}>
            {info
              ? info.metadata
              : <span className='--tmp'>This is a pool placeholder</span>}
          </div>
        </td>
        <td className='number media--1100'>
          {info
            ? info.bonded.state.type
            : <span className='--tmp'>Destroying</span>}
        </td>
        <Table.Column.Balance
          value={info?.bonded.points}
          withLoading
        />
        <td className='number media--1400'>{info && !info.rewardClaimable.isZero() && <FormatBalance value={info.rewardClaimable} />}</td>
        <td className='number'>{info && info.bonded.commission.current.value && <div>{info.bonded.commission.current.value[0]?.toHuman()}</div>}</td>
        <td className='number'>
          {info && info.nominating.length !== 0 && (
            <ExpanderScroll
              className='media--1300'
              empty={t('No nominees')}
              renderChildren={renderNominees}
              summary={t('Nominees ({{count}})', { replace: { count: info.nominating.length } })}
            />
          )}
        </td>
        <td className='number'>
          {members && members.length !== 0 && (
            <ExpanderScroll
              className='media--1200'
              empty={t('No members')}
              renderChildren={renderMembers}
              summary={t('Members ({{count}})', { replace: { count: members.length } })}
            />
          )}
        </td>
        <td className='button'>
          {info
            ? (
              <>
                <Join
                  isDisabled={!info.bonded.state.isOpen || (!!params.maxMembersPerPool && !info.bonded.memberCounter.ltn(params.maxMembersPerPool))}
                  ownAccounts={ownAccounts}
                  params={params}
                  poolId={poolId}
                />
                <ExpandButton
                  expanded={isExpanded}
                  onClick={toggleExpanded}
                />
              </>
            )
            : <Spinner noLabel />
          }
        </td>
      </StyledTr>
      {info && isExpanded && (
        <StyledTr className={`${className} isExpanded isLast`}>
          <td colSpan={4}>
            <div className='label-column-right'>
              <div className='label'>{t('creator')}</div>
              <div className='inline-balance'><AddressMini value={info.bonded.roles.depositor} /></div>
            </div>
            {info.bonded.roles.root.isSome && (
              <div className='label-column-right'>
                <div className='label'>{t('root')}</div>
                <div className='inline-balance'><AddressMini value={info.bonded.roles.root.unwrap()} /></div>
              </div>
            )}
            {info.bonded.roles.nominator.isSome && (
              <div className='label-column-right'>
                <div className='label'>{t('nominator')}</div>
                <div className='inline-balance'><AddressMini value={info.bonded.roles.nominator.unwrap()} /></div>
              </div>
            )}
            {(info.bonded.roles as { stateToggler?: { isSome: boolean } }).stateToggler?.isSome && (
              <div className='label-column-right'>
                <div className='label'>{t('toggler')}</div>
                <div className='inline-balance'><AddressMini value={(info.bonded.roles as unknown as { stateToggler: { unwrap: () => string } }).stateToggler.unwrap()} /></div>
              </div>
            )}
          </td>
          <td colSpan={4}>
            <div className='label-column-right'>
              <div className='label'>{t('stash')}</div>
              <div className='inline-balance'><AddressMini value={info.stashId} /></div>
            </div>
            <div className='label-column-right'>
              <div className='label'>{t('rewards')}</div>
              <div className='inline-balance'><AddressMini value={info.rewardId} /></div>
            </div>
          </td>
        </StyledTr>
      )}
    </>
  );
}

const StyledTr = styled.tr`
  .label-column-right,
  .label-column-left{
    display: flex;
    align-items: center;

    .label {
      width: 50%;
    }
  }

  .label {
    text-align: right;
    padding: 0 1.7rem 0 0;
    line-height: normal;
    color: var(--color-label);
    text-transform: lowercase;
  }

  .clamp {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    box-orient: vertical;
    display: -webkit-box;
    line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default React.memo(Pool);
