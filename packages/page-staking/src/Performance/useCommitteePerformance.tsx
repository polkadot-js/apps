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
}

export interface SessionCommitteePerformance {
  sessionId: number,
  performance: ValidatorPerformance[],
  expectedBlockCount: number,
}

export function parseSessionBlockCount (sessionValidatorBlockCountValue: [StorageKey<AnyTuple>, Codec][]): [string, number][] {
  return sessionValidatorBlockCountValue.map(([key, values]) => {
    const account = key.args[0].toString();
    const count = Number(values.toString());

    return [account, count];
  });
}

function useSessionCommitteePerformanceImpl (sessions: number[]): SessionCommitteePerformance[] {
  const { api } = useApi();

  const [firstBlockInSessionHashes, setFirstBlockInSessionHashes] = useState<Hash[]>([]);
  const [lastBlockInSessionsHashes, setLastBlockInSessionsHashes] = useState<Hash[]>([]);
  const [lastBlockInSessionPerAuraHashes, setLastBlockInSessionPerAuraHashes] = useState<Hash[]>([]);

  const [committees, setCommittees] = useState<string[][]>([]);
  const [sessionValidatorBlockCountLookups, setSessionValidatorBlockCountLookups] = useState<[string, number][][]>([]);
  const [lastBlockPerAuraAuthors, setLastBlockPerAuraAuthors] = useState<(string | undefined)[]>([]);
  const [committeeMemberPerformances, setCommitteeMemberPerformances] = useState<SessionCommitteePerformance[]>([]);

  function getSessionFirstAndLastBlock (session: number, sessionPeriod: number) {
    // due to how AURA works, first block of the session is actually N + 1, 0th (genesis) block
    // is treated in a special way. N % sessions_period block is the last session block.
    // however, due to how pallet elections writes down session validator block count we need to
    // read that storage map from one block before last block, as in the last block counter is
    // cleared; so we adjust +1 per block author info from what AURA thinks last block is
    return {
      first: session * sessionPeriod + 1,
      last: (session + 1) * sessionPeriod - 1,
      lastPerAura: (session + 1) * sessionPeriod
    };
  }

  useEffect(() => {
    if (api && api.consts.elections) {
      const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());

      const promises = sessions.map((session) => api.rpc.chain.getBlockHash(getSessionFirstAndLastBlock(session, sessionPeriod).first));

      Promise.all(promises)
        .then((blockHashes) => setFirstBlockInSessionHashes(blockHashes.filter((hash) => !hash.isEmpty)))
        .catch(console.error);
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(sessions)]
  );

  useEffect(() => {
    if (api && api.consts.elections) {
      const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());

      const promises = sessions.map((session) => api.rpc.chain.getBlockHash(getSessionFirstAndLastBlock(session, sessionPeriod).lastPerAura));

      Promise.all(promises)
        .then((blockHashes) => setLastBlockInSessionPerAuraHashes(blockHashes.filter((hash) => !hash.isEmpty)))
        .catch(console.error);
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(sessions)]
  );

  useEffect(() => {
    if (api && api.consts.elections) {
      const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
      const promises = sessions.map((session) => api.rpc.chain.getBlockHash(getSessionFirstAndLastBlock(session, sessionPeriod).last));

      Promise.all(promises)
        .then((blockHashes) => setLastBlockInSessionsHashes(blockHashes.filter((hash) => !hash.isEmpty)))
        .catch(console.error);
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(sessions)]
  );

  useEffect(() => {
    const promisesApisAtLastBlock = lastBlockInSessionsHashes.map((hash) => api.at(hash.toString()));

    Promise.all(promisesApisAtLastBlock).then((lastBlockApis) => {
      const promisesSessionValidatorBlockCountEntries = lastBlockApis.map((promise) => promise.query.elections.sessionValidatorBlockCount.entries());

      Promise.all(promisesSessionValidatorBlockCountEntries).then((entriesArray) =>
        setSessionValidatorBlockCountLookups(entriesArray.map((entries) => {
          return parseSessionBlockCount(entries);
        }))).catch(console.error);
    }).catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(lastBlockInSessionsHashes)]
  );

  useEffect(() => {
    const promisesLastBlockPerAuraHeaders = lastBlockInSessionPerAuraHashes.map((hash) =>
      api.derive.chain.getHeader(hash)
    );

    Promise.all(promisesLastBlockPerAuraHeaders).then((headersExtended) => {
      setLastBlockPerAuraAuthors(headersExtended.map((headerExtended) => headerExtended.author)
        .map((author) => author?.toString()));
    }).catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(lastBlockInSessionPerAuraHashes)]
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

  function getValidatorPerformance (validator: string,
    sessionValidatorBlockCountLookup: [string, number][] | undefined,
    lastBlockPerAuraAuthors: (string | undefined)[],
    index: number): ValidatorPerformance {
    const maybeCount = sessionValidatorBlockCountLookup?.find(([id]) => id === validator);
    let count = maybeCount
      ? maybeCount[1]
      : (sessionValidatorBlockCountLookup ? 0 : undefined);

    if (count && lastBlockPerAuraAuthors[index] === validator) {
      count += 1;
    }

    return {
      accountId: validator,
      blockCount: count
    };
  }

  useEffect(() => {
    setCommitteeMemberPerformances(sessions.map((session, index) => {
      const sessionValidatorBlockCountLookup = sessionValidatorBlockCountLookups[index];
      const committee = committees[index];
      const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());

      if (committee) {
        const validatorPerformances = committee.map((validator) => getValidatorPerformance(validator,
          sessionValidatorBlockCountLookup,
          lastBlockPerAuraAuthors,
          index));
        const committeePerformance: SessionCommitteePerformance = {
          expectedBlockCount: sessionPeriod / committee.length,
          performance: validatorPerformances,
          sessionId: session
        };

        return committeePerformance;
      }

      return {
        expectedBlockCount: 0,
        performance: [],
        sessionId: session
      };
    }));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [JSON.stringify(committees), JSON.stringify(sessionValidatorBlockCountLookups), JSON.stringify(sessions), JSON.stringify(lastBlockPerAuraAuthors)]
  );

  return committeeMemberPerformances;
}

export default createNamedHook('useSessionCommitteePerformance', useSessionCommitteePerformanceImpl);
