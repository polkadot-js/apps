// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';

import {createNamedHook, useApi} from '@polkadot/react-hooks';
import {StorageKey} from '@polkadot/types';
import {Hash} from '@polkadot/types/interfaces';
import { AnyTuple, Codec } from '@polkadot/types/types';

export interface ValidatorPerformance {
  accountId: string,
  blockCount: number,
  expectedBlockCount: number,
}

export interface SessionCommitteePerformance {
  sessionId: number,
  isPalletElectionsSupported: boolean | undefined,
  performance: ValidatorPerformance[],
}

function useSessionCommitteePerformanceImpl (sessions: number[]): SessionCommitteePerformance[]{
  const { api } = useApi();

  const [committeeMemberPerformances, setCommitteeMemberPerformances] = useState<ValidatorPerformance[]>([]);
  const [committee, setCommittee] = useState<string[]>([]);

  const [firstBlockInSessionHash, setFirstBlockInSessionHash] = useState<Hash | undefined>(undefined);
  const [lastBlockInSessionHash, setLastBlockInSessionHash] = useState<Hash | undefined>(undefined);
  const [firstSessionBlockAuthor, setFirstSessionBlockAuthor] = useState<string | undefined>(undefined);
  const [isPalletElectionsSupported, setIsPalletElectionsSupported] = useState<boolean | undefined>(undefined);

  const [sessionValidatorBlockCountLookup, setSessionValidatorBlockCountLookup] = useState<[string, number][]>([]);

  const MINIMUM_SUPPORTED_ELECTIONS_PALLET_VERSION = 3;

  useEffect(() => {
    const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
    const firstBlockInSession = sessions[0] * sessionPeriod;

    api.rpc.chain
      .getBlockHash(firstBlockInSession)
      .then((result): void => {
        setFirstBlockInSessionHash(result);
      })
      .catch(console.error);
  },
  [api, sessions[0]]
  );

  useEffect(() => {
    if (firstBlockInSessionHash) {
      api.at(firstBlockInSessionHash.toString()).then((result) => {
        result.query.elections.palletVersion().then((version) => {
          setIsPalletElectionsSupported(Number(version.toString()) >= MINIMUM_SUPPORTED_ELECTIONS_PALLET_VERSION);
        }).catch(console.error);
      }).catch(console.error);
    }
  }, [api, firstBlockInSessionHash]);

  useEffect(() => {
      const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
      const lastBlockInSession = (sessions[0] + 1) * sessionPeriod - 1;

      api.rpc.chain
        .getBlockHash(lastBlockInSession)
        .then((result): void => {
          !result.isEmpty && setLastBlockInSessionHash(result);
        })
        .catch(console.error);

  },
  [api, sessions[0]]
  );

  useEffect(() => {
    if (firstBlockInSessionHash) {
      api.derive.chain.getHeader(firstBlockInSessionHash).then((header) => {
        if (header && !header.isEmpty && header.author) {
          setFirstSessionBlockAuthor(header.author.toString());
        }
      }).catch(console.error);
    }
  },
  [api, firstBlockInSessionHash]
  );

  function parseSessionBlockCount (sessionValidatorBlockCountValue: [StorageKey<AnyTuple>, Codec][], firstSessionBlockAuthor: string): [string, number][] {
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

  useEffect(() => {
    if (lastBlockInSessionHash  && firstSessionBlockAuthor) {
      console.log(lastBlockInSessionHash);
      api.at(lastBlockInSessionHash.toString()).then((result) => {
        const sessionValidatorBlockCount = result.query.elections.sessionValidatorBlockCount;

        sessionValidatorBlockCount && sessionValidatorBlockCount.entries().then((value) => {
          setSessionValidatorBlockCountLookup(parseSessionBlockCount(value, firstSessionBlockAuthor));
        }).catch(console.error);
      }).catch(console.error);
    }
  }
  , [api, lastBlockInSessionHash, firstSessionBlockAuthor]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastBlockInSessionHash === undefined && firstSessionBlockAuthor) {
        api && api.query.elections && api.query.elections.sessionValidatorBlockCount &&
        api.query.elections.sessionValidatorBlockCount.entries().then((value) => {
          setSessionValidatorBlockCountLookup(parseSessionBlockCount(value, firstSessionBlockAuthor));
        }
        ).catch(console.error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [firstSessionBlockAuthor, sessions[0], api]);

  useEffect(() => {
    if (firstBlockInSessionHash) {
      api.at(firstBlockInSessionHash.toString()).then((resultApi) => {
        const validators = resultApi.query.session.validators;

        validators && validators().then((value) => {
          setCommittee(value.map((validator) => validator.toString()));
        }).catch(console.error);
      }).catch(console.error);
    }
  }, [api, firstBlockInSessionHash]
  );

  const expectedSessionValidatorBlockCount = useMemo(() => {
    const result: [string, number][] = [];

    // should not change at all during runtime, therefore it's fine to use current api object
    const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());

    const index = committee.findIndex((value) => value.toString() === firstSessionBlockAuthor);

    if (index === -1) {
      return [];
    }

    for (let i = 0; i < committee.length; i++) {
      const author = committee[(i + index) % committee.length];
      const offset = Math.max(sessionPeriod - i, 0);

      result.push([author.toString(), Math.ceil(offset / committee.length)]);
    }

    return result;
  },
  [api, firstSessionBlockAuthor, committee]
  );

  function getValidatorPerformance (validator: string,
    sessionValidatorBlockCountLookup: [string, number][],
    expectedSessionValidatorBlockCount: [string, number][]): ValidatorPerformance {
    const maybeCount = sessionValidatorBlockCountLookup.find(([id]) => id === validator);
    const count = maybeCount ? maybeCount[1] : 0;
    const maybeExpectedBlockCount = expectedSessionValidatorBlockCount.find(([id]) => id === validator);
    const expectedBlockCount = maybeExpectedBlockCount ? maybeExpectedBlockCount[1] : 0;
    return {
      accountId: validator,
      blockCount: count,
      expectedBlockCount,
    };
  }

  useEffect(() => {
    const committeeMemberPerformances = committee.map((validator) => getValidatorPerformance(validator,
      sessionValidatorBlockCountLookup,
      expectedSessionValidatorBlockCount));
    console.log(committee);
    console.log(committeeMemberPerformances);
    setCommitteeMemberPerformances(committeeMemberPerformances);
  },
  [committee, sessionValidatorBlockCountLookup, expectedSessionValidatorBlockCount]
  );

  return [{ sessionId: sessions[0], isPalletElectionsSupported, performance: committeeMemberPerformances}];
}

export default createNamedHook('useSessionCommitteePerformance', useSessionCommitteePerformanceImpl);
