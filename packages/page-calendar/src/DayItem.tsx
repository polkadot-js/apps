// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EntryInfo } from './types';

import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { formatNumber, isString } from '@polkadot/util';
import { dateCalendarFormat } from './util';
import { Button } from '@polkadot/react-components';

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

  const [description, setDescription] = useState<string>("");

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
      let s ='';
      switch (type) {
        case 'councilElection':
          s = 'Election of new council candidates';
          break;
        case 'councilMotion':
          s = 'Voting ends on council motion {{id}}';
          break;
        case 'democracyDispatch':
          s = 'Enactment of the result of referendum {{id}}';
          break;

        case 'democracyLaunch':
          s = 'Start of the next referendum voting period';
          break;

        case 'referendumDispatch':
          s = 'Potential dispatch of referendum {{id}} (if passed)';
          break;

        case 'referendumVote':
          s = 'Voting ends for referendum {{id}}';
          break;

        case 'scheduler':
          s = 'Execute named scheduled task';
          id && (s = s + ' {{id}}')
          break;

        case 'stakingEpoch':
          s = 'Start of a new staking session {{id}}';
          break;

        case 'stakingEra':
          s = 'Start of a new staking era {{id}}';
          break;

        case 'stakingSlash':
          s = 'Application of slashes from era {{id}}';
          break;

        case 'treasurySpend':
          s = 'Start of next spending period';
          break;

        case 'societyChallenge':
          s = 'Start of next membership challenge period';
          break;

        case 'societyRotate':
          s = 'Acceptance of new members and bids';
          break;

        default:
          return assertUnreachable(type);
      }
      setDescription(id ? s.replaceAll('{{id}}', id) : s);
      return id ? <><div className='itemDesc'>{t<string>(s, { replace: { id } })}</div>{typeLink}</> : (<><div className='itemDesc'>{s}</div>{typeLink}</>);
    },
    [info, t, type]
  );

  function exportToCal (fileName: string, date: Date): void {
    let startDate = dateCalendarFormat(date)
    // For now just add 1 hour for each event
    let endDate = dateCalendarFormat(new Date(new Date(date).setHours(new Date(date).getHours() + 1)));
    let test =
      "BEGIN:VCALENDAR\n" +
      "CALSCALE:GREGORIAN\n" +
      "METHOD:PUBLISH\n" +
      "PRODID:-//Test Cal//EN\n" +
      "VERSION:2.0\n" +
      "BEGIN:VEVENT\n" +
      "UID:test-1\n" +
      "DTSTART;VALUE=DATE:" + startDate + "\n" +
      "DTEND;VALUE=DATE:" + endDate + "\n" +
      "SUMMARY:" + description + "\n" +
      "DESCRIPTION:" + description + "\n" +
      "END:VEVENT\n" +
      "END:VCALENDAR";
    let fileNameIcs = encodeURI(fileName) + '.ics';
    let data = new File([test], fileNameIcs, { type: "text/plain" });
    const anchor = window.document.createElement('a');
    anchor.href = window.URL.createObjectURL(data);
    anchor.download = fileNameIcs;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(anchor.href);
  }

  function calendarIcon (date: Date): React.ReactNode {
    return date ? (<Button className='exportCal' icon='calendar-plus' onClick={() => exportToCal(description, date)} />) : null
  }

  return (
    <div className={className}>
      <div className='itemTime'>{date.toLocaleTimeString().split(':').slice(0, 2).join(':')}</div>
      {desc}
      {calendarIcon(date)}
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

  .exportCal {
    padding: 0;
    position: absolute;
    right: 1.5rem;
    
    .ui--Icon {
      width: 0.7rem;
      height: 0.7rem;
    }
  }

  .itemTime {
    background: #999;
    padding: 0 0.375rem;
    border-radius: 0.25rem;
    color: #eee;
  }
`);
