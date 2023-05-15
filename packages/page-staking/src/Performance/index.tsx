// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState } from 'react';

import { MarkWarning, Spinner } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import ActionsRow from './ActionsRow.js';
import HistoricPerformance from './HistoricPerformance.js';
import Performance from './Performance.js';
import useCurrentSessionInfo from './useCurrentSessionInfo.js';
import useEra from './useEra.js';

export interface SessionEra {
  session: number,
  era: number,
  currentSessionMode: boolean,
}

function PerformancePage (): React.ReactElement {
  const { api } = useApi();

  const [currentSession, currentEra, historyDepth, minimumSessionNumber] = useCurrentSessionInfo();

  const [inputSession, setInputSession] = useState<number | undefined>(undefined);
  const era = useEra(inputSession);

  const sessionEra = useMemo((): SessionEra | undefined => {
    if (era !== undefined && inputSession !== undefined && inputSession !== currentSession) {
      return { currentSessionMode: false, era, session: inputSession };
    }

    if (currentSession && currentEra) {
      return { currentSessionMode: true, era: currentEra, session: currentSession };
    }

    return undefined;
  }, [inputSession, currentEra, currentSession, era]);

  if (!api.runtimeChain.toString().includes('Aleph Zero')) {
    return (
      <MarkWarning content={'Unsupported chain.'} />
    );
  }

  if (!sessionEra) {
    return (
      <Spinner label={'loading data'} />
    );
  }

  return (
    <>
      <section className='performance--actionsrow'>
        <ActionsRow
          currentSession={currentSession}
          historyDepth={historyDepth}
          minimumSessionNumber={minimumSessionNumber}
          onSessionChange={setInputSession}
          selectedSession={sessionEra.session}
        />
      </section>
      <section>
        {sessionEra.currentSessionMode &&
        <Performance
          era={sessionEra.era}
          session={sessionEra.session}
        />}
        {!sessionEra.currentSessionMode &&
        <HistoricPerformance
          era={sessionEra.era}
          session={sessionEra.session}
        />}
      </section>
    </>
  );
}

export default React.memo(PerformancePage);
