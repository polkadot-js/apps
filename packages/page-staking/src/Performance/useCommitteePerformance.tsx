// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';
import { StorageKey } from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';
import { AnyTuple, Codec } from '@polkadot/types/types';

export interface ValidatorPerformance {
  accountId: string,
  blockCount?: number,
  expectedBlockCount: number,
}

export interface SessionCommitteePerformance {
  sessionId: number,
  isPalletElectionsSupported: boolean | undefined,
  performance: ValidatorPerformance[],
  firstSessionBlockAuthor: string | undefined,
}

export function parseSessionBlockCount (sessionValidatorBlockCountValue: [StorageKey<AnyTuple>, Codec][], firstSessionBlockAuthor: string): [string, number][] {
  return sessionValidatorBlockCountValue.map(([key, values]) => {
    const account = key.args[0].toString();
    let count = Number(values.toString());

    if (account === firstSessionBlockAuthor) {
      // a workaround for the fact that the first session block author is not reflected in that block
      // elections.sessionValidatorBlockCount state
      count += 1;
    }

    return [account, count];
  });
}

function getExpectedBlockCountLookup (committee: string[], firstSessionBlockAuthor: string, sessionPeriod: number) {
  const result: [string, number][] = [];

  const committeeIndex = committee.findIndex((value) => value.toString() === firstSessionBlockAuthor);

  if (committeeIndex !== -1) {
    for (let i = 0; i < committee.length; i++) {
      const author = committee[(i + committeeIndex) % committee.length];
      const offset = Math.max(sessionPeriod - i, 0);

      result.push([author.toString(), Math.ceil(offset / committee.length)]);
    }
  }

  return result;
}

function useSessionCommitteePerformanceImpl (sessions: number[]): SessionCommitteePerformance[] {
  const { api } = useApi();

  const [firstBlockInSessionHashes, setFirstBlockInSessionHashes] = useState<Hash[]>([]);
  const [isPalletElectionsSupportedInSession, setIsPalletElectionsSupportedInSession] = useState<boolean[]>([]);
  const [lastBlockInSessionsHashes, setLastBlockInSessionsHashes] = useState<Hash[]>([]);
  const [firstSessionBlockAuthors, setFirstSessionBlockAuthors] = useState<string[]>([]);
  const [sessionValidatorBlockCountLookups, setSessionValidatorBlockCountLookups] = useState<[string, number][][]>([]);
  const [expectedValidatorBlockCountLookups, setExpectedSessionValidatorBlockCountLookups] = useState<[string, number][][]>([]);
  const [committees, setCommittees] = useState<string[][]>([]);
  const [committeeMemberPerformances, setCommitteeMemberPerformances] = useState<SessionCommitteePerformance[]>([]);

  const MINIMUM_SUPPORTED_ELECTIONS_PALLET_VERSION = 3;

  useEffect(() => {
    if (api && api.consts.elections) {
      const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
      const promises = sessions.map((session) => api.rpc.chain.getBlockHash(session * sessionPeriod));

      Promise.all(promises)
        .then((blockHashes) => setFirstBlockInSessionHashes(blockHashes))
        .catch(console.error);
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(sessions)]
  );

  useEffect(() => {
    const promisesApiAtFirstBlock = firstBlockInSessionHashes.map((hash) => api.at(hash.toString()));

    Promise.all(promisesApiAtFirstBlock).then((apis) => {
      const promisesPalletVersions = apis.map((promise) => promise.query.elections.palletVersion());

      Promise.all(promisesPalletVersions)
        .then((palletElectionVersionInSession: Codec[]) => {
          const versions = palletElectionVersionInSession.map((version) => Number(version.toString()) >= MINIMUM_SUPPORTED_ELECTIONS_PALLET_VERSION);

          setIsPalletElectionsSupportedInSession(versions);
        }).catch(console.error);
    }).catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(firstBlockInSessionHashes)]
  );

  useEffect(() => {
    if (api && api.consts.elections) {
      const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
      const promises = sessions.map((session) => api.rpc.chain.getBlockHash((session + 1) * sessionPeriod - 1));

      Promise.all(promises)
        .then((blockHashes) => setLastBlockInSessionsHashes(blockHashes.filter((hash) => !hash.isEmpty)))
        .catch(console.error);
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(sessions)]
  );

  useEffect(() => {
    const promises = firstBlockInSessionHashes.map((hash) => api.derive.chain.getHeader(hash));

    Promise.all(promises).then((headers) =>
      setFirstSessionBlockAuthors(headers.map((header) => header.author ? header.author.toString() : '')))
      .catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(firstBlockInSessionHashes)]
  );

  useEffect(() => {
    const promisesApisAtLastBlock = lastBlockInSessionsHashes.map((hash) => api.at(hash.toString()));

    Promise.all(promisesApisAtLastBlock).then((lastBlockApis) => {
      const promisesSessionValidatorBlockCountEntries = lastBlockApis.map((promise) => promise.query.elections.sessionValidatorBlockCount.entries());

      Promise.all(promisesSessionValidatorBlockCountEntries).then((entriesArray) =>
        setSessionValidatorBlockCountLookups(entriesArray.map((entries, index) => {
          const firstSessionBlockAuthor = firstSessionBlockAuthors[index];

          return parseSessionBlockCount(entries, firstSessionBlockAuthor);
        }))).catch(console.error);
    }).catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(lastBlockInSessionsHashes), JSON.stringify(firstSessionBlockAuthors)]
  );

  useEffect(() => {
    const apisAtFirstBlockPromises = firstBlockInSessionHashes.map((hash) => api.at(hash.toString()));

    Promise.all(apisAtFirstBlockPromises).then((apis) => {
      const validatorsPromises = apis.map((api) => api.query.session.validators());

      Promise.all(validatorsPromises).then((validatorsOfValidators: Codec[][]) =>
        setCommittees(validatorsOfValidators.map((validators) =>
          validators.map((validator) => validator.toString()))))
        .catch(console.error);
    }
    ).catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(firstBlockInSessionHashes)]
  );

  useEffect(() => {
    setExpectedSessionValidatorBlockCountLookups(committees.map((committee, index) => {
      const firstSessionBlockAuthor = firstSessionBlockAuthors[index];
      const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());

      return getExpectedBlockCountLookup(committee, firstSessionBlockAuthor, sessionPeriod);
    }));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(firstSessionBlockAuthors), JSON.stringify(committees)]
  );

  function getValidatorPerformance (validator: string,
    sessionValidatorBlockCountLookup: [string, number][] | undefined,
    expectedSessionValidatorBlockCount: [string, number][]): ValidatorPerformance {
    const maybeExpectedBlockCount = expectedSessionValidatorBlockCount.find(([id]) => id === validator);
    const expectedBlockCount = maybeExpectedBlockCount ? maybeExpectedBlockCount[1] : 0;
    const maybeCount = sessionValidatorBlockCountLookup?.find(([id]) => id === validator);
    const count = maybeCount
      ? maybeCount[1]
      : (sessionValidatorBlockCountLookup ? 0 : undefined);

    return {
      accountId: validator,
      blockCount: count,
      expectedBlockCount
    };
  }

  useEffect(() => {
    setCommitteeMemberPerformances(sessions.map((session, index) => {
      const sessionValidatorBlockCountLookup = sessionValidatorBlockCountLookups[index];
      const expectedValidatorBlockCountLookup = expectedValidatorBlockCountLookups[index];
      const committee = committees[index];
      const isPalletElectionsSupported = isPalletElectionsSupportedInSession[index];
      const firstSessionBlockAuthor = firstSessionBlockAuthors[index];

      if (committee && expectedValidatorBlockCountLookup && firstSessionBlockAuthor) {
        const validatorPerformances = committee.map((validator) => getValidatorPerformance(validator,
          sessionValidatorBlockCountLookup,
          expectedValidatorBlockCountLookup));
        const committeePerformance: SessionCommitteePerformance = {
          firstSessionBlockAuthor,
          isPalletElectionsSupported,
          performance: validatorPerformances,
          sessionId: session
        };

        return committeePerformance;
      }

      return {
        firstSessionBlockAuthor: undefined,
        isPalletElectionsSupported: undefined,
        performance: [],
        sessionId: session
      };
    }));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [JSON.stringify(committees), JSON.stringify(sessionValidatorBlockCountLookups), JSON.stringify(expectedValidatorBlockCountLookups), JSON.stringify(sessions), JSON.stringify(isPalletElectionsSupportedInSession), JSON.stringify(firstSessionBlockAuthors)]
  );

  return committeeMemberPerformances;
}

export default createNamedHook('useSessionCommitteePerformance', useSessionCommitteePerformanceImpl);
