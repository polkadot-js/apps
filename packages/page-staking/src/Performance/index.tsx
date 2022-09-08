// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';

import { DeriveSessionProgress } from '@polkadot/api-derive/types';
import { useTranslation } from '@polkadot/app-staking/translate';
import { Input, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { EraIndex } from '@polkadot/types/interfaces';
import { Option, u32 } from '@polkadot/types-codec';

import Performance from './Performance';

interface Props {
  className?: string;
  favorites: string[];
  toggleFavorite: (address: string) => void;
}

export interface SessionEra {
  session: number,
  era: number,
  currentSessionMode: boolean,
}

type SessionIndexEntry = [{ args: [EraIndex] }, Option<u32>];

function PerformancePage ({ favorites, toggleFavorite }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session.progress);
  const historyDepth = useCall<number>(api.query.staking.historyDepth);
  const [{ isValid, key }, setValue] = useState<{ isValid: boolean; key: string }>(() => ({
    isValid: false,
    key: ''
  }));
  const [inputSession, setInputSession] = useState<number | null>(null);
  const erasStartSessionIndex = useCall<SessionIndexEntry[]>(api.query.staking.erasStartSessionIndex.entries);

  const currentSession = useMemo(() => {
    return sessionInfo?.currentIndex.toNumber();
  },
  [sessionInfo]
  );

  const currentEra = useMemo(() => {
    return sessionInfo?.currentEra.toNumber();
  },
  [sessionInfo]
  );

  const minimumSessionNumber = useMemo(() => {
    if (currentSession && historyDepth && sessionInfo) {
      return Math.max(currentSession - historyDepth * sessionInfo.sessionsPerEra.toNumber(), 1);
    }

    return null;
  },
  [historyDepth, currentSession, sessionInfo]
  );

  const _onChangeKey = useCallback(
    (key: string): void => {
      let valid = false;

      if (currentSession && historyDepth && minimumSessionNumber) {
        const sessionNumber = parseInt(key);

        if (!isNaN(sessionNumber)) {
          if (sessionNumber < currentSession && minimumSessionNumber <= sessionNumber) {
            valid = true;
          }
        }
      }

      setValue({
        isValid: valid,
        key
      });
    },
    [currentSession, minimumSessionNumber, historyDepth]
  );

  const _onAdd = useCallback(
    (): void => {
      if (isValid) {
        setInputSession(Number(key));
      }
    },
    [isValid, key]
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

  function calculateEra (session: number, erasStartSessionIndex: SessionIndexEntry[]) {
    const erasStartSessionIndexLookup: [number, number][] = [];

    erasStartSessionIndex.filter(([, values]) => values.isSome)
      .forEach(([key, values]) => {
        const eraIndex = key.args[0];

        erasStartSessionIndexLookup.push([eraIndex.toNumber(), values.unwrap().toNumber()]);
      });
    erasStartSessionIndexLookup.sort(([eraIndexA], [eraIndexB]) => {
      return eraIndexA - eraIndexB;
    });

    for (let i = 0; i < erasStartSessionIndexLookup.length; i++) {
      const eraIndex = erasStartSessionIndexLookup[i][0];
      const currentEraSessionStart = erasStartSessionIndexLookup[i][1];
      const currentEraSessionEnd = i + 1 < erasStartSessionIndexLookup.length ? erasStartSessionIndexLookup[i + 1][1] - 1 : undefined;

      if (currentEraSessionStart <= session && currentEraSessionEnd && session <= currentEraSessionEnd) {
        return eraIndex;
      }
    }

    const lastErasStartSessionIndexLookup = erasStartSessionIndexLookup.length - 1;

    return erasStartSessionIndexLookup[lastErasStartSessionIndexLookup][0];
  }

  const sessionEra = useMemo((): SessionEra | undefined => {
    if (currentSession && erasStartSessionIndex && currentEra) {
      if (inputSession) {
        return { currentSessionMode: false, era: calculateEra(inputSession, erasStartSessionIndex), session: inputSession };
      } else {
        return { currentSessionMode: true, era: currentEra, session: currentSession };
      }
    }

    return undefined;
  }, [inputSession, currentEra, currentSession, erasStartSessionIndex]);

  return (
    <div>
      {sessionEra === undefined && <Spinner label={'loading data'} />}
      {sessionEra !== undefined &&
        <section>
          <Input
            autoFocus
            help={help}
            isError={!isValid}
            label={t<string>('Session number')}
            onChange={_onChangeKey}
            onEnter={_onAdd}
          />
          <Performance
            favorites={favorites}
            sessionEra={sessionEra}
            toggleFavorite={toggleFavorite}
          />
        </section>
      }
    </div>);
}

export default React.memo(PerformancePage);
