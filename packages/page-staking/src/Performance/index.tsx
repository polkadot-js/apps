// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';

import { DeriveSessionProgress } from '@polkadot/api-derive/types';
import { useTranslation } from '@polkadot/app-staking/translate';
import { SortedTargets } from '@polkadot/app-staking/types';
import { Input, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Performance from './Performance';

interface Props {
  className?: string;
  favorites: string[];
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
}

export interface SessionEra {
  session: number,
  era?: number,
}

function PerformancePage ({ favorites, targets, toggleFavorite }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session.progress);
  const historyDepth = useCall<number>(api.query.staking.historyDepth);
  const [{ isValid, key }, setValue] = useState<{ isValid: boolean; key: string }>(() => ({
    isValid: false,
    key: ''
  }));
  const [inputSession, setInputSession] = useState<number | null>(null);

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

  if (!currentSession) {
    return (
      <Spinner label={'waiting for the first session'} />
    );
  }

  const [sessionEra, currentSessionMode] = inputSession
    ? [{ session: inputSession }, false]
    : [{ era: currentEra, session: currentSession }, true];

  console.log('sessionEra', sessionEra);

  return (
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
        currentSessionMode={currentSessionMode}
        favorites={favorites}
        sessionEra={sessionEra}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </section>
  );
}

export default React.memo(PerformancePage);
