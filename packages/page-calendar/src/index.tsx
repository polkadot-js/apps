// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Tabs } from '@polkadot/react-components';

import Day from './Day';
import Month from './Month';
import { useTranslation } from './translate';
import useScheduled from './useScheduled';

interface Props {
  basePath: string;
  className?: string;
}

const NOW_INC = 30 * 1000;

function CalendarApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const scheduled = useScheduled();
  const [now, setNow] = useState(new Date());
  const [selected, setSelected] = useState(new Date());

  const itemsRef = useRef([{
    isRoot: true,
    name: 'view',
    text: t<string>('Upcoming events')
  }]);

  useEffect((): () => void => {
    const intervalId = setInterval(() => setNow(new Date()), NOW_INC);

    return (): void => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
      </header>
      <div className='calendarFlex'>
        <Day
          date={selected}
          now={now}
          scheduled={scheduled}
        />
        <Month
          now={now}
          onChange={setSelected}
          scheduled={scheduled}
        />
      </div>
    </main>
  );
}

export default React.memo(styled(CalendarApp)`
  .calendarFlex {
    align-items: flex-start;
    display: flex;
    flex-wrap: nowrap;

    > div {
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 0.25rem;
    }
  }
`);
