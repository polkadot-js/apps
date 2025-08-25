// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';
import type { GenericExtrinsic, Vec } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { AnyTuple } from '@polkadot/types-codec/types';

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { MarkError, styled, Table, Toggle } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { isEventFromMyAccounts } from '@polkadot/react-hooks/utils/isEventFromMyAccounts';
import { formatNumber } from '@polkadot/util';

import Event from './Event.js';
import { useTranslation } from './translate.js';

const MAX_CACHE = 200;
const blockCache = new Map<string, { author: AccountId | undefined; extrinsics: Vec<GenericExtrinsic<AnyTuple>>}>();

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
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [showOnlyUserEvents, onToggleUserEvents] = useToggle();
  const [filteredEvents, setFilteredEvents] = useState<Props['events']>([]);

  const header = useMemo<[React.ReactNode?, string?, number?][]>(
    () => [
      [label || t('recent events'), 'start']
    ],
    [label, t]
  );

  useEffect(() => {
    const filter = async () => {
      if (!events || !showOnlyUserEvents) {
        return;
      }

      for (const event of events) {
        const { blockHash, record } = event;

        if (!blockHash) {
          continue;
        }

        // use cached block info if available
        let blockData = blockCache.get(blockHash);

        if (!blockData) {
          const [{ author }, block] = await Promise.all([
            await api.derive.chain.getHeader(blockHash),
            await api.rpc.chain.getBlock(blockHash)
          ]);
          const extrinsics = block.block.extrinsics;

          blockData = { author, extrinsics };
          blockCache.set(blockHash, blockData);

          // Evict oldest key
          if (blockCache.size > MAX_CACHE) {
            const oldest = blockCache.keys().next().value;

            oldest && blockCache.delete(oldest);
          }
        }

        const { author, extrinsics } = blockData;

        if (isEventFromMyAccounts(record, extrinsics, author, allAccounts)) {
          setFilteredEvents((prev) => {
            const alreadyExists = (prev ?? []).some((e) => e.key === event.key);

            if (alreadyExists) {
              return prev;
            }

            return [event, ...(prev ?? [])];
          });
        }
      }
    };

    filter().catch(console.error);
  }, [allAccounts, api.derive.chain, api.rpc.chain, events, showOnlyUserEvents]);

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
          : (showOnlyUserEvents ? filteredEvents : events)?.map((e) => renederEvent(eventClassName, e))
        }
      </Table>
      {showToggle &&
        <Toggle
          label={t('Show my events')}
          onChange={onToggleUserEvents}
          value={showOnlyUserEvents}
        />
      }
    </StyledSection>
  );
}

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
