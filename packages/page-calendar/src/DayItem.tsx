// Copyright 2017-2022 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EntryInfoTyped } from './types';

import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@polkadot/react-components';
import { formatNumber, isString } from '@polkadot/util';

import { useTranslation } from './translate';
import { dateCalendarFormat } from './util';

interface Props {
  className?: string;
  showAllEvents?: boolean;
  item: EntryInfoTyped;
}

const FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  weekday: 'long',
  year: 'numeric'
};

function assertUnreachable (type: string): never {
  throw new Error(`We should not get here, unhandled ${type}`);
}

function exportCalendar (date: Date, description: string): void {
  const startDate = dateCalendarFormat(date);
  // For now just add 1 hour for each event
  const endDate = dateCalendarFormat(new Date(new Date(date).setHours(new Date(date).getHours() + 1)));
  const calData =
    'BEGIN:VCALENDAR\n' +
    'CALSCALE:GREGORIAN\n' +
    'METHOD:PUBLISH\n' +
    'PRODID:-//Test Cal//EN\n' +
    'VERSION:2.0\n' +
    'BEGIN:VEVENT\n' +
    'UID:test-1\n' +
    'DTSTART;VALUE=DATE:' + startDate + '\n' +
    'DTEND;VALUE=DATE:' + endDate + '\n' +
    'SUMMARY:' + description + '\n' +
    'DESCRIPTION:' + description + '\n' +
    'END:VEVENT\n' +
    'END:VCALENDAR';
  const fileNameIcs = encodeURI(description) + '.ics';
  const data = new File([calData], fileNameIcs, { type: 'text/plain' });
  const anchor = window.document.createElement('a');

  anchor.href = window.URL.createObjectURL(data);
  anchor.download = fileNameIcs;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(anchor.href);
}

function createLink (to: string, desc: string): React.ReactNode {
  return <div className='itemLink'><a href={`#/${to}`}>{desc}</a></div>;
}

function DayItem ({ className, item: { blockNumber, date, info, type }, showAllEvents }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const [description, setDescription] = useState<string>('');

  const _exportCal = useCallback(
    () => exportCalendar(date, description),
    [description, date]
  );

  const desc = useMemo(
    (): React.ReactNode => {
      const id: string | null = info && (
        isString(info)
          ? info
          : formatNumber(info)
      );
      const typeLink = ['councilElection'].includes(type)
        ? createLink('council', t<string>('via Council'))
        : ['councilMotion'].includes(type)
          ? createLink('council/motions', t<string>('via Council/Motions'))
          : ['democracyDispatch', 'scheduler'].includes(type)
            ? createLink('democracy/dispatch', t<string>('via Democracy/Dispatch'))
            : ['democracyLaunch', 'referendumDispatch', 'referendumVote'].includes(type)
              ? createLink('/democracy', t<string>('via Democracy'))
              : ['societyChallenge', 'societyRotate'].includes(type)
                ? createLink('society', t<string>('via Society'))
                : ['stakingEpoch', 'stakingEra'].includes(type)
                  ? createLink('staking', t<string>('via Staking'))
                  : ['stakingSlash'].includes(type)
                    ? createLink('staking/slashes', t<string>('via Staking/Slashed'))
                    : ['treasurySpend'].includes(type)
                      ? createLink('treasury', t<string>('via Treasury'))
                      : ['parachainLease'].includes(type)
                        ? createLink('parachains', t<string>('via Parachains'))
                        : ['parachainAuction'].includes(type)
                          ? createLink('parachains/auction', t<string>('via Parachains/Auction'))
                          : undefined;
      let s = '';

      switch (type) {
        case 'councilElection':
          s = t<string>('Election of new council candidates');
          break;

        case 'councilMotion':
          s = t<string>('Voting ends on council motion {{id}}', { replace: { id } });
          break;

        case 'democracyDispatch':
          s = t<string>('Enactment of the result of referendum {{id}}', { replace: { id } });
          break;

        case 'democracyLaunch':
          s = t<string>('Start of the next referendum voting period');
          break;

        case 'parachainAuction':
          s = t<string>('End of the current parachain auction {{id}}', { replace: { id } });
          break;

        case 'parachainLease':
          s = t<string>('Start of the next parachain lease period {{id}}', { replace: { id } });
          break;

        case 'referendumDispatch':
          s = t<string>('Potential dispatch of referendum {{id}} (if passed)', { replace: { id } });
          break;

        case 'referendumVote':
          s = t<string>('Voting ends for referendum {{id}}', { replace: { id } });
          break;

        case 'scheduler':
          s = id
            ? t<string>('Execute named scheduled task {{id}}', { replace: { id } })
            : t<string>('Execute anonymous scheduled task');
          break;

        case 'stakingEpoch':
          s = t<string>('Start of a new staking session {{id}}', { replace: { id } });
          break;

        case 'stakingEra':
          s = t<string>('Start of a new staking era {{id}}', { replace: { id } });
          break;

        case 'stakingSlash':
          s = t<string>('Application of slashes from era {{id}}', { replace: { id } });
          break;

        case 'treasurySpend':
          s = t<string>('Start of next spending period');
          break;

        case 'societyChallenge':
          s = t<string>('Start of next membership challenge period');
          break;

        case 'societyRotate':
          s = t<string>('Acceptance of new members and bids');
          break;

        default:
          return assertUnreachable(type);
      }

      setDescription(s);

      return (<><div className='itemDesc'>{s}</div>{typeLink}</>);
    },
    [info, t, type]
  );

  return (
    <div className={className}>
      {showAllEvents &&
        <div className='itemDate'>{date.toLocaleString(undefined, FORMAT_OPTIONS)}</div>
      }
      <div className='itemTime'>{date.toLocaleTimeString().split(':').slice(0, 2).join(':')}</div>
      <div className='itemBlock'>#{formatNumber(blockNumber)}</div>
      {desc}
      {date && (
        <Button
          className={showAllEvents ? 'exportCal exportCal-allEvents' : 'exportCal'}
          icon='calendar-plus'
          onClick={_exportCal}
        />
      )}
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

  > div.itemTime+div.itemBlock {
    margin-left: 0.25rem;
  }

  .exportCal {
    padding: 0;
    position: absolute;
    right: 1.5rem;

    .ui--Icon {
      width: 0.7rem;
      height: 0.7rem;
    }
  }

  .exportCal-allEvents {
    right: 3.5rem;
  }

  .itemBlock {
    background: #aaa;
    color: #eee;
    font-size: 0.85rem;
    align-self: center;
    padding: 0.075rem 0.375rem;
    border-radius: 0.25rem;
  }

  .itemDate {
    padding: 0 0.375rem;
    border-radius: 0.25rem;
    width: 17rem;
  }

  .itemTime {
    background: #999;
    color: #eee;
    padding: 0 0.375rem;
    border-radius: 0.25rem;
  }
`);
