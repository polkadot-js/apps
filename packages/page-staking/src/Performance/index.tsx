// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedTargets } from '../types';

import React, { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { Vec } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { Struct, u32 } from '@polkadot/types-codec';

import ActionsBanner from './ActionsBanner';
import CurrentList from './CurrentList';
import Summary from './Summary';

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

type SessionValidatorBlockCountEntry = [{ args: [AccountId] }, u32];

function Performance ({ className = '', favorites, session, targets, toggleFavorite }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const currentEraValidators = useCall<CurrentEraValidators>(api.query.elections.currentEraValidators);
  const sessionValidatorBlockCountEntries = useCall<SessionValidatorBlockCountEntry[]>(api.query.elections.sessionValidatorBlockCount.entries);

  const sessionValidatorBlockCountLookup = useMemo(
    () => {
      const sessionValidatorBlockCountLookup: Record<string, number> = {};

      sessionValidatorBlockCountEntries?.forEach(([key, values]) => {
        const account = key.args[0].toString();

        sessionValidatorBlockCountLookup[account] = values.toNumber();
      });

      return sessionValidatorBlockCountLookup;
    },
    [sessionValidatorBlockCountEntries]
  );

  const [eraValidators, currentSessionCommittee] = useMemo(
    () => {
      if (!currentEraValidators || !sessionValidatorBlockCountLookup) {
        return [[], []];
      }

      const currentSessionCommittee = Object.keys(sessionValidatorBlockCountLookup);
      const eraValidators = currentEraValidators?.nonReserved.toArray().concat(currentEraValidators?.reserved.toArray());

      return [eraValidators, currentSessionCommittee];
    },
    [currentEraValidators, sessionValidatorBlockCountLookup]
  );

  return (
    <div className={`staking--Performance ${className}`}>
      <Summary
        currentSessionCommittee={currentSessionCommittee}
        eraValidators={eraValidators}
        targets={targets}
      />
      <ActionsBanner />
      <CurrentList
        currentSessionCommittee={currentSessionCommittee}
        favorites={favorites}
        session={session}
        sessionValidatorBlockCountLookup={sessionValidatorBlockCountLookup}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default React.memo(Performance);
