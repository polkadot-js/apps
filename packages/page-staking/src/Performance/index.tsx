// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState } from 'react';

import { MarkWarning, Spinner, SummaryBox, ToggleGroup } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import ActionsRow from './ActionsRow.js';
import EraValidators from './EraValidators.js';
import FinalityCommittee from './FinalityCommittee.js';
import HistoricPerformance from './HistoricPerformance.js';
import Performance from './Performance.js';
import SummarySession from './SummarySession.js';
import useCurrentSessionInfo from './useCurrentSessionInfo.js';
import useEra from './useEra.js';

export interface SessionEra {
  session: number,
  era: number,
  currentSessionMode: boolean,
}

function PerformancePage (): React.ReactElement {
  const { api } = useApi();
  const { t } = useTranslation();

  const groups = [
    { text: t<string>('Era validators'), value: 'validators' },
    { text: t<string>('Block production committee'), value: 'block' },
    { text: t<string>('Finality committee'), value: 'finality' }
  ];

  const [groupIndex, setGroupIndex] = useState(1);

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
      <section>
        <SummaryBox>
          <section>
            <SummarySession
              era={sessionEra.era}
              session={sessionEra.session}
            />
          </section>
        </SummaryBox>
      </section>
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
        <ToggleGroup
          onChange={setGroupIndex}
          options={groups}
          value={groupIndex}
        />
      </section>
      <section>
        {groupIndex === 0 && <EraValidators session={sessionEra.session} />}
        {groupIndex === 1 && (
          <>
            {sessionEra.currentSessionMode
              ? (
                <Performance
                  era={sessionEra.era}
                  session={sessionEra.session}
                />
              )
              : (
                <HistoricPerformance
                  era={sessionEra.era}
                  session={sessionEra.session}
                />
              )}
          </>
        )}
        {groupIndex === 2 && <FinalityCommittee session={sessionEra.session} />}
      </section>
    </>
  );
}

export default React.memo(PerformancePage);
