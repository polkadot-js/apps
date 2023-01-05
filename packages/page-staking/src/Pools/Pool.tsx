// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { MembersMapEntry, Params } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import { AddressMini, ExpandButton, ExpanderScroll, Spinner, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import Join from './Join';
import usePoolInfo from './usePoolInfo';

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
    () => members.map(({ accountId, member }, count) => (
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
    () => info && info.nominating.map((stashId, count) => (
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
      <tr className={className}>
        <Table.Column.Id value={poolId} />
        <td className='start'>
          {info && (
            <div className={isExpanded ? '' : 'clamp'}>{info.metadata}</div>
          )}
        </td>
        <td className='number media--1100'>{info && info.bonded.state.type}</td>
        <td className='number'>{info && <FormatBalance value={info.bonded.points} />}</td>
        <td className='number media--1400'>{info && !info.rewardClaimable.isZero() && <FormatBalance value={info.rewardClaimable} />}</td>
        <td className='number'>
          {info && info.nominating.length !== 0 && (
            <ExpanderScroll
              className='media--1300'
              empty={t<string>('No nominees')}
              renderChildren={renderNominees}
              summary={t<string>('Nominees ({{count}})', { replace: { count: info.nominating.length } })}
            />
          )}
        </td>
        <td className='number'>
          {members && members.length !== 0 && (
            <ExpanderScroll
              className='media--1200'
              empty={t<string>('No members')}
              renderChildren={renderMembers}
              summary={t<string>('Members ({{count}})', { replace: { count: members.length } })}
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
      </tr>
      {info && isExpanded && (
        <tr className={`${className} isExpanded`}>
          <td colSpan={4}>
            <div className='label-column-right'>
              <div className='label'>{t('creator')}</div>
              <div className='inline-balance'><AddressMini value={info.bonded.roles.depositor} /></div>
            </div>
            {info.bonded.roles.root.isSome && (
              <div className='label-column-right'>
                <div className='label'>{t('root')}</div>
                <div className='inline-balance'><AddressMini value={info.bonded.roles.root} /></div>
              </div>
            )}
            {info.bonded.roles.nominator.isSome && (
              <div className='label-column-right'>
                <div className='label'>{t('nominator')}</div>
                <div className='inline-balance'><AddressMini value={info.bonded.roles.nominator} /></div>
              </div>
            )}
            {info.bonded.roles.stateToggler.isSome && (
              <div className='label-column-right'>
                <div className='label'>{t('toggler')}</div>
                <div className='inline-balance'><AddressMini value={info.bonded.roles.stateToggler} /></div>
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
        </tr>
      )}
    </>
  );
}

export default React.memo(styled(Pool)`
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
`);
