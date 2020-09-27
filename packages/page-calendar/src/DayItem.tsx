// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EntryInfo } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { formatNumber, isString } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  item: EntryInfo;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertUnreachable (x: never): never {
  throw new Error('We cannot get here');
}

function DayItem ({ className, item: { date, info, type } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const desc = useMemo(
    (): React.ReactNode => {
      const id: string | null = info && (
        isString(info)
          ? info
          : formatNumber(info)
      );
      const typeLink = ['councilElection'].includes(type)
        ? <div className='itemLink'><a href='#/council'>{t<string>('via Council')}</a></div>
        : ['councilMotion'].includes(type)
          ? <div className='itemLink'><a href='#/council/motions'>{t<string>('via Council/Motions')}</a></div>
          : ['democracyDispatch', 'scheduler'].includes(type)
            ? <div className='itemLink'><a href='#/democracy/dispatch'>{t<string>('via Democracy/Dispatch')}</a></div>
            : ['democracyLaunch', 'referendumDispatch', 'referendumVote'].includes(type)
              ? <div className='itemLink'><a href='#/democracy'>{t<string>('via Democracy')}</a></div>
              : ['societyChallenge', 'societyRotate'].includes(type)
                ? <div className='itemLink'><a href='#/society'>{t<string>('via Society')}</a></div>
                : ['stakingEpoch', 'stakingEra'].includes(type)
                  ? <div className='itemLink'><a href='#/staking'>{t<string>('via Staking')}</a></div>
                  : ['stakingSlash'].includes(type)
                    ? <div className='itemLink'><a href='#/staking/slashes'>{t<string>('via Staking/Slashed')}</a></div>
                    : ['treasurySpend'].includes(type)
                      ? <div className='itemLink'><a href='#/treasury'>{t<string>('via Treasury')}</a></div>
                      : undefined;

      switch (type) {
        case 'councilElection':
          return <><div className='itemDesc'>{t<string>('Election of new council candidates')}</div>{typeLink}</>;

        case 'councilMotion':
          return <><div className='itemDesc'>{t<string>('Voting ends on council motion {{id}}', { replace: { id } })}</div>{typeLink}</>;

        case 'democracyDispatch':
          return <><div className='itemDesc'>{t<string>('Enactment of the result of referendum {{id}}', { replace: { id } })}</div>{typeLink}</>;

        case 'democracyLaunch':
          return <><div className='itemDesc'>{t<string>('Start of the next referendum voting period')}</div>{typeLink}</>;

        case 'referendumDispatch':
          return <><div className='itemDesc'>{t<string>('Potential dispatch of referendum {{id}} (if passed)', { replace: { id } })}</div>{typeLink}</>;

        case 'referendumVote':
          return <><div className='itemDesc'>{t<string>('Voting ends for referendum {{id}}', { replace: { id } })}</div>{typeLink}</>;

        case 'scheduler':
          return <><div className='itemDesc'>{
            id
              ? t<string>('Execute named scheduled task {{id}}', { replace: { id } })
              : t<string>('Execute anonymous scheduled task')
          }</div>{typeLink}</>;

        case 'stakingEpoch':
          return <><div className='itemDesc'>{t<string>('Start of a new staking session {{id}}', { replace: { id } })}</div>{typeLink}</>;

        case 'stakingEra':
          return <><div className='itemDesc'>{t<string>('Start of a new staking era {{id}}', { replace: { id } })}</div>{typeLink}</>;

        case 'stakingSlash':
          return <><div className='itemDesc'>{t<string>('Application of slashes from era {{id}}', { replace: { id } })}</div>{typeLink}</>;

        case 'treasurySpend':
          return <><div className='itemDesc'>{t<string>('Start of next spending period')}</div>{typeLink}</>;

        case 'societyChallenge':
          return <><div className='itemDesc'>{t<string>('Start of next membership challenge period')}</div>{typeLink}</>;

        case 'societyRotate':
          return <><div className='itemDesc'>{t<string>('Acceptance of new members and bids')}</div>{typeLink}</>;

        default:
          return assertUnreachable(type);
      }
    },
    [info, t, type]
  );

  return (
    <div className={className}>
      <div className='itemTime'>{date.toLocaleTimeString().split(':').slice(0, 2).join(':')}</div>
      {desc}
    </div>
  );
}

export default React.memo(styled(DayItem)`
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
  margin: 0.5rem 0.75rem;

  > div+div {
    margin-left: 0.5rem;
  }

  .itemTime {
    background: #999;
    padding: 0 0.375rem;
    border-radius: 0.25rem;
    color: #eee;
  }
`);
