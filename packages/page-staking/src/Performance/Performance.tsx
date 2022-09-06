// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedTargets } from '../types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiDecoration } from '@polkadot/api/types';
import { MarkWarning } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { StorageKey, Vec } from '@polkadot/types';
import { AccountId, EraIndex, Hash } from '@polkadot/types/interfaces';
import { AnyTuple, Codec } from '@polkadot/types/types';
import { Option, Struct, u32 } from '@polkadot/types-codec';

import ActionsBanner from './ActionsBanner';
import CurrentList from './CurrentList';
import { SessionEra } from './index';
import Summary from './Summary';

interface Props {
  className?: string;
  favorites: string[];
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  sessionEra: SessionEra,
  currentSessionMode: boolean,
}

interface CurrentEraValidators extends Struct {
  reserved: Vec<AccountId>;
  nonReserved: Vec<AccountId>;
}

interface CommitteeSize extends Struct {
  nonReservedSeats: u32
  reservedSeats: u32,
}

type SessionIndexEntry = [{ args: [EraIndex] }, Option<u32>];

function Performance ({ className = '', currentSessionMode, favorites, sessionEra, targets, toggleFavorite }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  const erasStartSessionIndex = useCall<SessionIndexEntry[]>(api.query.staking.erasStartSessionIndex.entries);
  const [firstBlockInSessionHash, setFirstBlockInSessionHash] = useState<Hash | null>(null);
  const [lastBlockInSessionHash, setLastBlockInSessionHash] = useState<Hash | null>(null);
  const [currentEraValidators, setCurrentEraValidators] = useState<CurrentEraValidators | null>(null);
  const [committeeSize, setCommitteeSize] = useState<CommitteeSize | null>(null);
  const [sessionValidatorBlockCountLookup, setSessionValidatorBlockCountLookup] = useState<Record<string, number>>({});
  const [firstSessionBlockAuthor, setFirstSessionBlockAuthor] = useState<string>('');
  const [isPalletElectionsSupported, setIsPalletElectionsSupported] = useState<boolean>(false);

  const MINIMUM_SUPPORTED_ELECTIONS_PALLET_VERSION = 3;

  const era: number | null = useMemo(() => {
    if (currentSessionMode) {
      if (!sessionEra.era) {
        console.warn('sessionEra.era should not be undefined in the current session mode!');

        return null;
      }

      return sessionEra.era;
    }

    if (!erasStartSessionIndex) {
      return null;
    }

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
      const currentEraSessionEnd = i + 1 < erasStartSessionIndexLookup.length ? erasStartSessionIndexLookup[i + 1][1] - 1 : null;

      if (currentEraSessionStart <= sessionEra.session && currentEraSessionEnd && sessionEra.session <= currentEraSessionEnd) {
        console.log([eraIndex, currentEraSessionStart]);

        return eraIndex;
      }
    }

    const lastErasStartSessionIndexLookup = erasStartSessionIndexLookup.length - 1;

    return erasStartSessionIndexLookup[lastErasStartSessionIndexLookup][0];
  },
  [erasStartSessionIndex, sessionEra, currentSessionMode]
  );

  useEffect(() => {
    if (era) {
      const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
      const firstBlockInSession = sessionEra.session * sessionPeriod;

      console.log('firstBlockInSession', firstBlockInSession);
      api.rpc.chain
        .getBlockHash(firstBlockInSession)
        .then((result): void => {
          console.log('firstBlockInSessionHash', result.toString());
          setFirstBlockInSessionHash(result);
        })
        .catch(console.error);

      if (!currentSessionMode) {
        const lastBlockInSession = (sessionEra.session + 1) * sessionPeriod - 1;

        console.log('lastBlockInSession', lastBlockInSession);
        api.rpc.chain
          .getBlockHash(lastBlockInSession)
          .then((result): void => {
            console.log('lastBlockInSessionHash', result.toString());
            setLastBlockInSessionHash(result);
          })
          .catch(console.error);
      }
    }
  },
  [api, era, sessionEra.session, currentSessionMode]
  );

  function getSessionValidators (currentApi: ApiDecoration<'promise'>) {
    currentApi.query.elections.palletVersion().then((version) => {
      console.log('Pallet storage version', version.toString());

      if (Number(version.toString()) >= MINIMUM_SUPPORTED_ELECTIONS_PALLET_VERSION) {
        setIsPalletElectionsSupported(true);
        currentApi.query.elections.currentEraValidators().then((currentEraValidatorsValue) => {
          if (currentEraValidatorsValue) {
            console.log(currentEraValidatorsValue);
            setCurrentEraValidators(currentEraValidatorsValue as CurrentEraValidators);
          }
        }).catch(console.error);
        currentApi.query.elections.committeeSize().then((committeeSizeValue) => {
          if (committeeSizeValue) {
            console.log(committeeSizeValue);
            setCommitteeSize(committeeSizeValue as CommitteeSize);
          }
        }).catch(console.error);
      } else {
        setIsPalletElectionsSupported(false);
      }
    }).catch(console.error);
  }

  useEffect(() => {
    if (firstBlockInSessionHash) {
      api.at(firstBlockInSessionHash.toString()).then((result) => {
        if (result) {
          getSessionValidators(result);
        }
      }).catch(console.error);
      api.derive.chain.getHeader(firstBlockInSessionHash).then((header) => {
        if (header && !header.isEmpty && header.author) {
          setFirstSessionBlockAuthor(header.author.toString());
        }
      }).catch(console.error);
    }
  },
  [api, firstBlockInSessionHash]
  );

  const parseSessionValidatorBlockCount = useCallback((sessionValidatorBlockCountValue: [StorageKey<AnyTuple>, Codec][]) => {
    const sessionValidatorBlockCountLookup: Record<string, number> = {};

    sessionValidatorBlockCountValue.forEach(([key, values]) => {
      const account = key.args[0].toString();

      sessionValidatorBlockCountLookup[account] = Number(values.toString());

      if (account === firstSessionBlockAuthor) {
        // a workaround for the fact that the first session block author is not reflected in that block
        // elections.sessionValidatorBlockCount state
        sessionValidatorBlockCountLookup[account] += 1;
      }
    });
    console.log('sessionValidatorBlockCountLookup', sessionValidatorBlockCountLookup);
    setSessionValidatorBlockCountLookup(sessionValidatorBlockCountLookup);
  }, [firstSessionBlockAuthor]
  );

  const setBlockCountLookup = useCallback((currentApi: ApiDecoration<'promise'>) => {
    currentApi.query.elections.palletVersion().then((version) => {
      console.log('Pallet storage version', version.toString());

      if (Number(version.toString()) >= MINIMUM_SUPPORTED_ELECTIONS_PALLET_VERSION) {
        currentApi.query.elections.sessionValidatorBlockCount.entries().then((sessionValidatorBlockCountValue) => {
          if (sessionValidatorBlockCountValue) {
            parseSessionValidatorBlockCount(sessionValidatorBlockCountValue);
          }
        }).catch(console.error);
      } else {
        setIsPalletElectionsSupported(false);
      }
    }).catch(console.error);
  }, [parseSessionValidatorBlockCount]
  );

  useEffect(() => {
    if (lastBlockInSessionHash && isPalletElectionsSupported && firstSessionBlockAuthor) {
      api.at(lastBlockInSessionHash.toString()).then((result) => {
        if (result) {
          setBlockCountLookup(result);
        }
      }).catch(console.error);
    }
  },
  [api, lastBlockInSessionHash, isPalletElectionsSupported, firstSessionBlockAuthor, setBlockCountLookup]
  );

  useEffect(() => {
    if (isPalletElectionsSupported && firstSessionBlockAuthor && currentSessionMode) {
      setBlockCountLookup(api);
    }
  },
  [api, isPalletElectionsSupported, firstSessionBlockAuthor, currentSessionMode, setBlockCountLookup]
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

  const [eraValidators, currentSessionCommittee] = useMemo(
    () => {
      if (!currentEraValidators || !committeeSize || !isPalletElectionsSupported) {
        return [null, null];
      }

      const nonReserved = currentEraValidators.nonReserved.toArray();
      const reserved = currentEraValidators.reserved.toArray();
      const nonReservedFreeSeats = committeeSize.nonReservedSeats.toNumber();
      const reservedFreeSeats = committeeSize.reservedSeats.toNumber();
      const currentSession = sessionEra.session;

      const chosenFromNonReserved = chooseForSession(nonReserved, nonReservedFreeSeats, currentSession);
      const chosenFromReserved = chooseForSession(reserved, reservedFreeSeats, currentSession);

      const currentSessionCommittee = chosenFromReserved.concat(chosenFromNonReserved);
      const eraValidators = reserved.concat(nonReserved);

      console.log('eraValidators', eraValidators);
      console.log('currentSessionCommittee', currentSessionCommittee);

      return [eraValidators, currentSessionCommittee];
    },
    [currentEraValidators, committeeSize, sessionEra, isPalletElectionsSupported]
  );

  const expectedSessionValidatorBlockCount = useMemo(() => {
    console.log('firstSessionBlockAuthor, eraValidators, currentSessionCommittee', firstSessionBlockAuthor, eraValidators, currentSessionCommittee);

    if (!firstSessionBlockAuthor || !eraValidators || !currentSessionCommittee || !isPalletElectionsSupported) {
      return {};
    }

    const resultLookup: Record<string, number> = {};

    // should not change at all during runtime, therefore it's fine to use current api object
    const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());

    console.log('sessionPeriod', sessionPeriod);
    console.log('firstSessionBlockAuthor', firstSessionBlockAuthor);
    const index = currentSessionCommittee.findIndex((value) => value.toString() === firstSessionBlockAuthor);

    if (index === -1) {
      console.warn('Sth went wrong, could not find first block session author!');

      return {};
    }

    console.log('currentSessionCommittee', currentSessionCommittee);
    console.log('index', index);

    for (let i = 0; i < currentSessionCommittee.length; i++) {
      const author = currentSessionCommittee[(i + index) % currentSessionCommittee.length];
      const offset = Math.max(sessionPeriod - i, 0);

      resultLookup[author.toString()] = Math.ceil(offset / currentSessionCommittee.length);
    }

    console.log('resultLookup', resultLookup);

    return resultLookup;
  },
  [api, firstSessionBlockAuthor, eraValidators, currentSessionCommittee, isPalletElectionsSupported]
  );

  useEffect(() => {
    if (currentSessionMode) {
      setTimeout(() => {
        console.log('Setting timeout');
        api && api.query.elections && api.query.elections.sessionValidatorBlockCount &&
        api.query.elections.sessionValidatorBlockCount.entries().then(
          (result) => {
            if (result) {
              parseSessionValidatorBlockCount(result);
            }
          }
        ).catch(console.error);
      }, 1000);
    }
  });

  return (
    <div className={`staking--Performance ${className}`}>
      {!isPalletElectionsSupported
        ? <MarkWarning
          className='warning centered'
          content={<>Unsupported pallet elections storage version. Choose more recent session number.</>}
        />
        : (<>
          <Summary
            currentSessionCommittee={currentSessionCommittee || []}
            era={era}
            eraValidators={eraValidators || []}
            session={sessionEra.session}
            targets={targets}
          />
          <ActionsBanner />
          <CurrentList
            currentSessionCommittee={currentSessionCommittee || []}
            eraValidators={eraValidators || []}
            expectedSessionValidatorBlockCount={expectedSessionValidatorBlockCount}
            favorites={favorites}
            session={sessionEra.session}
            sessionValidatorBlockCountLookup={sessionValidatorBlockCountLookup}
            targets={targets}
            toggleFavorite={toggleFavorite}
          />
        </>)}
    </div>
  );
}

export default React.memo(Performance);
