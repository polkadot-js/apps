// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';
import type { GenericExtrinsic } from '@polkadot/types';
import type { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';
import type { Vec } from '@polkadot/types-codec';
import type { AnyTuple } from '@polkadot/types-codec/types';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { styled, Table, Toggle } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';
import { isEventFromMyAccounts } from '@polkadot/react-hooks/utils/isEventFromMyAccounts';

import { useTranslation } from '../translate.js';
import ExtrinsicDisplay from './Extrinsic.js';

interface Props {
  blockNumber?: BlockNumber;
  className?: string;
  events?: KeyedEvent[] | null;
  label?: React.ReactNode;
  maxBlockWeight?: BN;
  value?: Extrinsic[] | null;
  withLink: boolean;
}

function Extrinsics ({ blockNumber, className = '', events, label, maxBlockWeight, value, withLink }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const [showOnlyUserEvents, onToggleUserEvents] = useToggle();

  const header = useMemo<[React.ReactNode?, string?, number?][]>(
    () => [
      [label || t('extrinsics'), 'start', 2],
      [t('events'), 'start media--1000', 2],
      [t('weight'), 'media--1400'],
      [
        <EventsToggle
          key='eventsToggle'
          onToggleUserEvents={onToggleUserEvents}
          showOnlyUserEvents={showOnlyUserEvents}
        />,
        'end media--1000'
      ]
    ],
    [label, onToggleUserEvents, showOnlyUserEvents, t]
  );

  const filteredEvents = useMemo(() => {
    if (!showOnlyUserEvents) {
      return events;
    }

    return events?.filter((event) => isEventFromMyAccounts(event.record, value as Vec<GenericExtrinsic<AnyTuple>>, undefined, allAccounts));
  }, [allAccounts, events, showOnlyUserEvents, value]);

  return (
    <Table
      className={className}
      empty={t('No extrinsics available')}
      header={header}
      isFixed
    >
      {value?.map((extrinsic, index): React.ReactNode =>
        <ExtrinsicDisplay
          blockNumber={blockNumber}
          events={filteredEvents}
          index={index}
          key={`extrinsic:${index}`}
          maxBlockWeight={maxBlockWeight}
          value={extrinsic}
          withLink={withLink}
        />
      )}
    </Table>
  );
}

interface EventsToggleProps {
  showOnlyUserEvents: boolean;
  onToggleUserEvents: () => void;
}

const EventsToggle = ({ onToggleUserEvents, showOnlyUserEvents }: EventsToggleProps) => {
  const { t } = useTranslation();

  return (
    <StyledDiv>
      <Toggle
        label={t('Show my events')}
        onChange={onToggleUserEvents}
        value={showOnlyUserEvents}
      />
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  .ui--Toggle {
    label{
      font-size: var(--font-size-base);
    }
  }
`;

export default React.memo(Extrinsics);
