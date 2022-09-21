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

function useSessionCommitteePerformanceImpl (sessions: number[]): SessionCommitteePerformance[] {
  const { api } = useApi();

  const MAX_POSSIBLE_SESSIONS = 1000;

  const [firstBlockInSessionHashes, setFirstBlockInSessionHashes] = useState<(Hash | undefined)[]>(Array(MAX_POSSIBLE_SESSIONS).fill(undefined));
  const [isPalletElectionsSupportedInSession, setIsPalletElectionsSupportedInSession] = useState<(boolean | undefined)[]>(Array(MAX_POSSIBLE_SESSIONS).fill(undefined));
  const [lastBlockInSessionsHashes, setLastBlockInSessionsHashes] = useState<(Hash | undefined)[]>(Array(MAX_POSSIBLE_SESSIONS).fill(undefined));
  const [firstSessionBlockAuthors, setFirstSessionBlockAuthors] = useState<(string | undefined)[]>(Array(MAX_POSSIBLE_SESSIONS).fill(undefined));
  const [sessionValidatorBlockCountLookups, setSessionValidatorBlockCountLookups] = useState<[string, number][][]>(Array(MAX_POSSIBLE_SESSIONS).fill(undefined));
  const [expectedValidatorBlockCountLookups, setExpectedSessionValidatorBlockCountLookups] = useState<[string, number][][]>(Array(MAX_POSSIBLE_SESSIONS).fill(undefined));
  const [committees, setCommittees] = useState<string[][]>(Array(MAX_POSSIBLE_SESSIONS).fill(undefined));
  // TODO comment why init is one off
  const [committeeMemberPerformances, setCommitteeMemberPerformances] = useState<SessionCommitteePerformance[]>([]);

  const MINIMUM_SUPPORTED_ELECTIONS_PALLET_VERSION = 3;

  useEffect(() => {
    console.log('sessions in hook', sessions);
    const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
    const firstBlocksInSession = sessions.map((session) => session * sessionPeriod);

    firstBlocksInSession.forEach((firstBlockInSession, index) => {
      api.rpc.chain
        .getBlockHash(firstBlockInSession)
        .then((result): void => {
          setFirstBlockInSessionHashes((existingItems) => {
            return existingItems.map((item, j) => {
              return j === index ? result : item;
            });
          });
        })
        .catch(console.error);
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(sessions)]
  );

  useEffect(() => {
    firstBlockInSessionHashes.forEach((firstBlockInSessionHash, index) => {
      if (firstBlockInSessionHash) {
        api.at(firstBlockInSessionHash.toString()).then((result) => {
          result.query.elections.palletVersion().then((version) => {
            setIsPalletElectionsSupportedInSession((existingItems) => {
              return existingItems.map((item, j) => {
                return j === index ? (Number(version.toString()) >= MINIMUM_SUPPORTED_ELECTIONS_PALLET_VERSION) : item;
              });
            });
          }).catch(console.error);
        }).catch(console.error);
      }
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(firstBlockInSessionHashes)]
  );

  useEffect(() => {
    const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
    const lastBlocksInSession = sessions.map((session) => (session + 1) * sessionPeriod - 1);

    lastBlocksInSession.forEach((lastBlockInSession, index) => {
      api.rpc.chain
        .getBlockHash(lastBlockInSession)
        .then((maybeHash): void => {
          maybeHash && !maybeHash.isEmpty &&
          setLastBlockInSessionsHashes((existingItems) => {
            return existingItems.map((item, j) => {
              return j === index ? maybeHash : item;
            });
          });
        })
        .catch(console.error);
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(sessions)]
  );

  useEffect(() => {
    firstBlockInSessionHashes.forEach((maybeHash, index) => {
      if (maybeHash && !maybeHash.isEmpty) {
        api.derive.chain.getHeader(maybeHash).then((header) => {
          if (header && !header.isEmpty && header.author) {
            setFirstSessionBlockAuthors((existingItems) => {
              return existingItems.map((item, j) => {
                return j === index ? header.author?.toString() : item;
              });
            });
          }
        }).catch(console.error);
      }
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(firstBlockInSessionHashes)]
  );

  useEffect(() => {
    lastBlockInSessionsHashes.forEach((maybeHash, index) => {
      const firstSessionBlockAuthor = firstSessionBlockAuthors[index];

      if (maybeHash && !maybeHash.isEmpty && firstSessionBlockAuthor) {
        api.at(maybeHash.toString()).then((result) => {
          const sessionValidatorBlockCount = result.query.elections.sessionValidatorBlockCount;

          firstSessionBlockAuthor && sessionValidatorBlockCount && sessionValidatorBlockCount.entries().then((value) => {
            const blockCount = parseSessionBlockCount(value, firstSessionBlockAuthor);

            setSessionValidatorBlockCountLookups((existingItems) => {
              return existingItems.map((item, j) => {
                return j === index ? blockCount : item;
              });
            });
          }).catch(console.error);
        }).catch(console.error);
      }
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(lastBlockInSessionsHashes), JSON.stringify(firstSessionBlockAuthors)]
  );

  useEffect(() => {
    firstBlockInSessionHashes.forEach((maybeHash, index) => {
      if (maybeHash && !maybeHash.isEmpty) {
        api.at(maybeHash.toString()).then((resultApi) => {
          const validators = resultApi.query.session.validators;

          validators && validators().then((value) => {
            const validatorAccounts = value.map((validator) => validator.toString());

            setCommittees((existingItems) => {
              return existingItems.map((item, j) => {
                return j === index ? validatorAccounts : item;
              });
            });
          }).catch(console.error);
        }).catch(console.error);
      }
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(firstBlockInSessionHashes)]
  );

  useEffect(() => {
    committees.forEach((committee, index) => {
      if (committee) {
        const firstSessionBlockAuthor = firstSessionBlockAuthors[index];
        const result: [string, number][] = [];
        const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
        const committeeIndex = committee.findIndex((value) => value.toString() === firstSessionBlockAuthor);

        if (committeeIndex !== -1) {
          for (let i = 0; i < committee.length; i++) {
            const author = committee[(i + committeeIndex) % committee.length];
            const offset = Math.max(sessionPeriod - i, 0);

            result.push([author.toString(), Math.ceil(offset / committee.length)]);
          }

          setExpectedSessionValidatorBlockCountLookups((existingItems) => {
            return existingItems.map((item, j) => {
              return j === index ? result : item;
            });
          });
        }
      }
    });
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
        console.log('sessionId', session);
        console.log('sessionValidatorBlockCountLookup', sessionValidatorBlockCountLookup);
        console.log('expectedValidatorBlockCountLookup', expectedValidatorBlockCountLookup);
        console.log('isPalletElectionsSupported', isPalletElectionsSupported);
        console.log('firstSessionBlockAuthor', firstSessionBlockAuthor);
        console.log('committee', committee);

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
