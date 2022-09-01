// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedTargets } from '../types';

import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';

import { DeriveSessionProgress } from '@polkadot/api-derive/types';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Vec } from '@polkadot/types';
import {AccountId, EraIndex, Hash} from '@polkadot/types/interfaces';
import {Option, Struct, u32} from '@polkadot/types-codec';

import ActionsBanner from './ActionsBanner';
import CurrentList from './CurrentList';
import Summary from './Summary';
import {BlockAuthorsContext} from "@polkadot/react-query";

interface Props {
  className?: string;
  favorites: string[];
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  session?: number,
}

interface CurrentEraValidators extends Struct {
  reserved: Vec<AccountId>;
  nonReserved: Vec<AccountId>;
}

export interface CommitteeSize {
  nonReservedSeats: u32
  reservedSeats: u32,
}

type SessionIndexEntry = [{ args: [EraIndex] }, Option<u32>];

function Performance ({ className = '', favorites, session, targets, toggleFavorite }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const currentEraValidators = useCall<CurrentEraValidators>(api.query.elections.currentEraValidators);
  const [sessionValidatorBlockCountLookup, setSessionValidatorBlockCountLookup] = useState({});
  const committeeSize = useCall<CommitteeSize>(api.query.elections.committeeSize);
  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session.progress);
  const [currentSessionCached, setCurrentSessionCached] = useState(0);
  const sessionChanged = useRef(false);
  const { lastHeaders } = useContext(BlockAuthorsContext);
  const [ lastHeaderAuthorCached, setLastHeaderAuthorCached] = useState('');
  const [firstBlockInSessionHash, setFirstBlockInSessionHash] = useState<Hash | null>(null);
  const erasStartSessionIndex = useCall<SessionIndexEntry[]>(api.query.staking.erasStartSessionIndex.entries);

  // to be used later on
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  const [era, eraFirstSession, eraLastSession]: [number | undefined, number | undefined, number | undefined] = useMemo(
    () => {
      console.log('erasStartSessionIndex has changed');
      if (!sessionInfo || !erasStartSessionIndex) {
        return [undefined, undefined, undefined];
      }

      const erasStartSessionIndexLookup: Record<number, number> = {};

      erasStartSessionIndex.filter(([, values]) => values.isSome)
        .forEach(([key, values]) => {
          const eraIndex = key.args[0];

          erasStartSessionIndexLookup[eraIndex.toNumber()] = values.unwrap().toNumber();
        });

      let currentEra = sessionInfo.activeEra.toNumber();
      let currentEraSessionStart: number = erasStartSessionIndexLookup[currentEra];
      let currentEraSessionEnd = null;
      const currentSession = sessionInfo.currentIndex.toNumber();

      while (currentEraSessionStart > currentSession) {
        currentEraSessionEnd = currentEraSessionStart - 1;
        currentEra = currentEra - 1;
        currentEraSessionStart = erasStartSessionIndexLookup[currentEra];
      }

      console.log(currentEra, currentEraSessionStart, currentEraSessionEnd);
      return [currentEra, currentEraSessionStart, currentEraSessionEnd];
    },
    [erasStartSessionIndex]
  );

  useEffect(() => {
    setTimeout(() => {
      api && api.query.elections && api.query.elections.sessionValidatorBlockCount &&
      api.query.elections.sessionValidatorBlockCount.entries().then(
        (result) => {
          if (result) {
            const sessionValidatorBlockCountLookup: Record<string, number> = {};

            result.forEach(([key, values]) => {
              const account = key.args[0].toString();

              sessionValidatorBlockCountLookup[account] = Number(values.toString());
            });
            setSessionValidatorBlockCountLookup(sessionValidatorBlockCountLookup);
          }
        }
      ).catch(console.error);
    }, 1000);
  });

  useEffect( () => {
    if (eraFirstSession) {
      console.log(eraFirstSession);
      const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
      let firstBlockInSession = eraFirstSession * sessionPeriod;
      api.rpc.chain
        .getBlockHash(firstBlockInSession)
        .then((result): void => {
          setFirstBlockInSessionHash(result);
        })
        .catch(console.error);
       }
    },
    [api, eraFirstSession]
  );

  useEffect(() => {
    if (firstBlockInSessionHash) {
      console.log(firstBlockInSessionHash.toString());
    }
    },
    [firstBlockInSessionHash]
  );

  useEffect(() => {
    let lastHeader = lastHeaders
          .filter((header) => !!header)[0];
        if (lastHeader && lastHeader.author) {
          setLastHeaderAuthorCached(lastHeader.author.toString());
          if (sessionChanged.current) {
            console.log(lastHeaderAuthorCached);
            console.log(currentSessionCached);
            sessionChanged.current = false;
          }
        }
    }, [lastHeaders]
  );


  const [eraValidators, currentSessionCommittee] = useMemo(
    () => {
      if (!currentEraValidators || !sessionInfo || !committeeSize) {
        return [[], []];
      }
      const nonReserved = currentEraValidators.nonReserved.toArray();
      const reserved = currentEraValidators.reserved.toArray();
      const nonReservedFreeSeats = committeeSize.nonReservedSeats.toNumber();
      const reservedFreeSeats = committeeSize.reservedSeats.toNumber();
      const currentSession = sessionInfo.currentIndex.toNumber();

      const chosenFromNonReserved = chooseForSession(nonReserved, nonReservedFreeSeats, currentSession);
      const chosenFromReserved = chooseForSession(reserved, reservedFreeSeats, currentSession);

      const currentSessionCommittee = chosenFromReserved.concat(chosenFromNonReserved);
      const eraValidators = reserved.concat(nonReserved);
      if (currentSession != currentSessionCached) {
        sessionChanged.current = true;
        setCurrentSessionCached(currentSession);
      }

      return [eraValidators, currentSessionCommittee];
    },
    [currentEraValidators, sessionInfo, committeeSize]
  );

  function chooseForSession (validators: AccountId[], count: number, sessionIndex: number) {
    const validatorsLength = validators.length;
    const firstIndex = sessionIndex * count % validatorsLength;
    const chosen: Array<AccountId> = [];

    for (let i = 0; i < Math.min(count, validatorsLength); i++) {
      chosen.push(validators[(firstIndex + i) % validatorsLength]);
    }

    return chosen;
  }

  return (
    <div className={`staking--Performance ${className}`}>
      <Summary
        currentSessionCommittee={currentSessionCommittee}
        eraValidators={eraValidators}
        targets={targets}
      />
      <ActionsBanner />
      <CurrentList
        committeeSize={committeeSize}
        currentSessionCommittee={currentSessionCommittee}
        favorites={favorites}
        session={session}
        sessionInfo={sessionInfo}
        sessionValidatorBlockCountLookup={sessionValidatorBlockCountLookup}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default React.memo(Performance);
