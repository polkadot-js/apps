// Copyright 2017-2025 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EntryInfoTyped } from './types.js';

import React, { useCallback, useMemo } from 'react';

import { Button, styled } from '@polkadot/react-components';

import DayItem from './DayItem.js';
import { useTranslation } from './translate.js';

interface Props {
  className?: string;
  scheduled: EntryInfoTyped[];
  setView: (v: boolean) => void;
}

function UpcomingEvents ({ className, scheduled, setView }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const sched = useMemo(
    () => scheduled.sort((a, b) => a.dateTime - b.dateTime),
    [scheduled]
  );

  const _setView = useCallback(
    (): void => setView(false),
    [setView]
  );

  return (
    <StyledDiv className={className}>
      <h1>
        <div>
          <Button
            className='all-events-button'
            icon='calendar'
            onClick={_setView}
          />
          {t('Upcoming Events')}
        </div>
      </h1>
      <ul className='allEventsWrapper'>
        {sched.map((item, index): React.ReactNode => {
          return (
            <DayItem
              className='all-events-rows'
              item={item}
              key={index}
              showAllEvents
            />
          );
        })}
      </ul>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  flex: 0;
  max-width: max-content;

  .all-events-rows {
    padding: 10px 0;
    font-size: 13px;
    &:nth-child(odd) {
      background: var(--bg-table);
    }
  }

  .allEventsWrapper {
    padding-inline-start: 10px;
  }
`;

export default React.memo(UpcomingEvents);
