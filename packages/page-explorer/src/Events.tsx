// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { MarkError, styled, Table, Toggle } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import Event from './Event.js';
import { useTranslation } from './translate.js';

interface Props {
  className?: string;
  error?: Error | null;
  emptyLabel?: React.ReactNode;
  events?: KeyedEvent[] | null;
  eventClassName?: string;
  label?: React.ReactNode;
  showToggle?: boolean
}

function renederEvent (className: string | undefined, { blockHash, blockNumber, indexes, key, record }: KeyedEvent): React.ReactNode {
  return (
    <tr
      className={className}
      key={key}
    >
      <td className='overflow relative'>
        <Event value={record} />
        {blockNumber && (
          <div className='absolute --digits'>
            {indexes.length !== 1 && <span>{formatNumber(indexes.length)}x&nbsp;</span>}
            <Link to={`/explorer/query/${blockHash || ''}`}>{formatNumber(blockNumber)}-{indexes[0].toString().padStart(2, '0')}</Link>
          </div>
        )}
      </td>
    </tr>
  );
}

function Events ({ className = '', emptyLabel, error, eventClassName, events, label, showToggle = false }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo<[React.ReactNode?, string?, number?][]>(
    () => [
      [label || t('recent events'), 'start']
    ],
    [label, t]
  );

  return (
    <StyledSection>
      <Table
        className={className}
        empty={emptyLabel || t('No events available')}
        header={header}
      >
        {error
          ? (
            <tr
              className={eventClassName}
              key='error'
            >
              <td><MarkError content={t('Unable to decode the block events. {{error}}', { replace: { error: error.message } })} /></td>
            </tr>
          )
          : events?.map((e) => renederEvent(eventClassName, e))
        }
      </Table>
      {showToggle && <ShowRelevantEventsToggle />}
    </StyledSection>
  );
}

const ShowRelevantEventsToggle = () => {
  const { t } = useTranslation();
  const [showRelevantEvents, setShowRelevantEvents] = useToggle();

  return (
    <Toggle
      label={t('Show my events')}
      onChange={setShowRelevantEvents}
      value={showRelevantEvents}
    />
  );
};

const StyledSection = styled.section`
  position: relative;

  .ui--Toggle {
    position: absolute;
    top: 1.4rem;
    right: 1rem;
    z-index: 999;
  }
`;

export default React.memo(Events);
