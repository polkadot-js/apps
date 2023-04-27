// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';

import { Button, Input, MarkWarning, Spinner } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
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
  const { t } = useTranslation();
  const { api } = useApi();

  const [currentSession, currentEra, historyDepth, minimumSessionNumber] = useCurrentSessionInfo();

  const [parsedSessionNumber, setParsedSessionNumber] = useState<number | undefined>(undefined);
  const [inputSession, setInputSession] = useState<number | undefined>(undefined);
  const era = useEra(inputSession);

  const sessionEra = useMemo((): SessionEra | undefined => {
    if (era && inputSession) {
      return { currentSessionMode: false, era, session: inputSession };
    }

    if (currentSession && currentEra) {
      return { currentSessionMode: true, era: currentEra, session: currentSession };
    }

    return undefined;
  }, [inputSession, currentEra, currentSession, era]);

  const _onChangeKey = useCallback(
    (key: string): void => {
      let isInputSessionNumberCorrect = false;

      if (currentSession && historyDepth && minimumSessionNumber) {
        const sessionNumber = parseInt(key);

        if (!isNaN(sessionNumber)) {
          if (sessionNumber < currentSession && minimumSessionNumber <= sessionNumber) {
            isInputSessionNumberCorrect = true;
          }
        }
      }

      isInputSessionNumberCorrect
        ? setParsedSessionNumber(Number(key))
        : setParsedSessionNumber(undefined);
    },
    [currentSession, minimumSessionNumber, historyDepth]
  );

  const _onAdd = useCallback(
    (): void => {
      if (parsedSessionNumber) {
        setInputSession(parsedSessionNumber);
      }
    },
    [parsedSessionNumber]
  );

  const help = useMemo(() => {
    const constraints = [
      typeof minimumSessionNumber === 'number' && `${t<string>('not smaller than')} ${minimumSessionNumber}`,
      typeof currentSession === 'number' && `${t<string>('not greater than')} ${currentSession}`
    ];

    const msg = constraints.filter(Boolean).join(', ');

    return msg && ` - ${msg}`;
  },
  [t, currentSession, minimumSessionNumber]
  );

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
      <section className='performance--actionrow'>
        <div className='performance--actionrow-value'>
          <Input
            autoFocus
            isError={!parsedSessionNumber}
            label={`${t<string>('Session number')} ${help}`}
            onChange={_onChangeKey}
            onEnter={_onAdd}
          />
        </div>
        <div className='performance--actionrow-buttons'>
          <Button
            icon='play'
            isDisabled={!parsedSessionNumber}
            onClick={_onAdd}
          />
        </div>
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
