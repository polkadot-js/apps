// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';

import { useTranslation } from '@polkadot/app-staking/translate';
import {Button, Input, MarkWarning, Spinner} from '@polkadot/react-components';
import {useApi} from '@polkadot/react-hooks';
import Performance from "@polkadot/app-staking/Performance/Performance";
import useEra from './useEra';
import useCurrentSessionInfo from "@polkadot/app-staking/Performance/useCurrentSessionInfo";

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
      return {currentSessionMode: false, era: era, session: inputSession};
    }
    if (currentSession && currentEra) {
      return {currentSessionMode: true, era: currentEra, session: currentSession};
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
    let msg = t<string>('Enter past session number.');

    if (currentSession) {
      msg += ' Current one is ' + currentSession.toString() + '.';

      if (minimumSessionNumber) {
        msg += ' Minimum session number is ' + minimumSessionNumber.toString() + '.';
      }
    }

    return msg;
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
            help={help}
            isError={!parsedSessionNumber}
            label={t<string>('Session number')}
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
         <Performance
           sessionEra={sessionEra}
         />
       </section>
    </>
  );
}

export default React.memo(PerformancePage);

