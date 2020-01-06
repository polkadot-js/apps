// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, EventRecord, Hash, Header, StorageChangeSet } from '@polkadot/types/interfaces';
import { Slash, SessionRewards } from './types';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { registry } from '@polkadot/react-api';
import { useApi, useCacheKey, useIsMountedRef } from '@polkadot/react-hooks';
import { createType } from '@polkadot/types';
import { bnMax, u8aToU8a } from '@polkadot/util';

interface SerializedSlash {
  accountId: string;
  amount: string;
}

interface Serialized {
  blockHash: string;
  blockNumber: string;
  isEventsEmpty: boolean;
  parentHash: string;
  reward: string;
  sessionIndex: string;
  slashes: SerializedSlash[];
  treasury: string;
}

const MAX_BLOCKS = 2500;

function fromJSON (sessions: Serialized[]): SessionRewards[] {
  let keepAll = false;

  return sessions
    .map(({ blockHash, blockNumber, isEventsEmpty, parentHash, reward, sessionIndex, slashes, treasury }): SessionRewards => ({
      blockHash: createType(registry, 'Hash', blockHash),
      blockNumber: createType(registry, 'BlockNumber', blockNumber),
      isEventsEmpty,
      parentHash: createType(registry, 'Hash', parentHash),
      reward: createType(registry, 'Balance', reward),
      sessionIndex: createType(registry, 'SessionIndex', sessionIndex),
      slashes: slashes.map(({ accountId, amount }): Slash => ({
        accountId: createType(registry, 'AccountId', accountId),
        amount: createType(registry, 'Balance', amount)
      })),
      treasury: createType(registry, 'Balance', treasury)
    }))
    .filter(({ parentHash }): boolean => !parentHash.isEmpty)
    .reverse()
    // we drop everything before the last reward
    .filter(({ reward }): boolean => {
      if (reward.gtn(0)) {
        keepAll = true;
      }

      return keepAll;
    })
    .reverse();
}

function toJSON (sessions: SessionRewards[], maxSessions: number): Serialized[] {
  return sessions.map(({ blockHash, blockNumber, isEventsEmpty, parentHash, reward, sessionIndex, slashes, treasury }): Serialized => ({
    blockHash: blockHash.toHex(),
    blockNumber: blockNumber.toHex(),
    isEventsEmpty,
    parentHash: parentHash.toHex(),
    reward: reward.toHex(),
    sessionIndex: sessionIndex.toHex(),
    slashes: slashes.map(({ accountId, amount }): SerializedSlash => ({
      accountId: accountId.toString(),
      amount: amount.toHex()
    })),
    treasury: treasury.toHex()
  })).slice(-maxSessions);
}

function mergeResults (sessions: SessionRewards[], newSessions: SessionRewards[]): SessionRewards[] {
  const tmp = sessions
    .concat(newSessions)
    .sort((a, b): number => a.blockNumber.cmp(b.blockNumber));

  // for the first, always use it, otherwise ignore on same sessionIndex
  return tmp.filter(({ sessionIndex }, index): boolean =>
    index === 0 || !tmp[index - 1].sessionIndex.eq(sessionIndex)
  );
}

async function loadSome (api: ApiPromise, fromHash: Hash, toHash: Hash): Promise<SessionRewards[]> {
  // query a range of blocks - on non-archive nodes this will fail, so return an empty set
  const results = await api.rpc.state
    .queryStorage([api.query.session.currentIndex.key()], fromHash, toHash)
    .catch((): StorageChangeSet[] => []);
  const headers = await Promise.all(
    results.map(({ block }): Promise<Header> => api.rpc.chain.getHeader(block))
  );
  const events: EventRecord[][] = await Promise.all(
    results.map(({ block }): Promise<EventRecord[]> =>
      (api.query.system.events.at(block) as unknown as Promise<EventRecord[]>)
        .then((records): EventRecord[] =>
          records.filter(({ event: { section } }): boolean => section === 'staking')
        )
        .catch((): EventRecord[] => []) // may throw, update metadata for old
    )
  );
  const slashes: Slash[][] = events.map((info): Slash[] =>
    info
      .filter(({ event: { method } }): boolean => method === 'Slash')
      .map(({ event: { data: [accountId, amount] } }): Slash => ({
        accountId: accountId as any,
        amount: amount as any
      }))
  );
  const rewards: [Balance | undefined, Balance | undefined][] = events.map((info): [Balance | undefined, Balance | undefined] => {
    const rewards = info.filter(({ event: { method } }): boolean => method === 'Reward');

    return [rewards[0]?.event?.data[0] as Balance, rewards[0]?.event?.data[1] as Balance];
  });

  // For old v1, the query results have empty spots (subsequently fixed in v2),
  // filter these before trying to extract the results
  return results
    .filter(({ changes }): boolean => !!(changes && changes.length))
    .map(({ changes: [[, value]] }, index): SessionRewards => ({
      blockHash: headers[index].hash,
      blockNumber: headers[index].number.unwrap(),
      isEventsEmpty: events[index].length === 0,
      parentHash: headers[index].parentHash,
      reward: rewards[index][0] || createType(registry, 'Balance'),
      sessionIndex: createType(registry, 'SessionIndex', u8aToU8a(
        value.isSome ? value.unwrap() : new Uint8Array([])
      )),
      slashes: slashes[index],
      treasury: rewards[index][1] || createType(registry, 'Balance')
    }));
}

export default function useSessionRewards (maxSessions: number): SessionRewards[] {
  const { api } = useApi();
  const mounted = useIsMountedRef();
  const [getCache, setCache] = useCacheKey<Serialized[]>('hooks:sessionSlashes');
  const [filtered, setFiltered] = useState<SessionRewards[]>([]);

  useEffect((): void => {
    let workQueue = fromJSON(getCache() || []);
    const savedNumber = workQueue[workQueue.length - 1]
      ? workQueue[workQueue.length - 1].blockNumber
      : undefined;

    setImmediate((): void => {
      api.isReady.then(async (): Promise<void> => {
        const maxSessionsStore = maxSessions + 1; // assuming first is a bust
        const bestHeader = await api.rpc.chain.getHeader();
        let toHash = bestHeader.hash;
        let toNumber = bestHeader.number.unwrap().toBn();
        let fromNumber = bnMax(toNumber.subn(MAX_BLOCKS), new BN(1));

        while (true) {
          // console.log(`Updating rewards cache, #${fromNumber} -> #${toNumber}`);

          const fromHash = await api.rpc.chain.getBlockHash(fromNumber as any);
          const newQueue = await loadSome(api, fromHash, toHash);

          workQueue = mergeResults(workQueue, newQueue);
          toHash = fromHash;
          toNumber = fromNumber;
          fromNumber = bnMax(toNumber.subn(MAX_BLOCKS), new BN(1));

          if (mounted.current) {
            setCache(toJSON(workQueue, maxSessionsStore));
            setFiltered(workQueue.slice(-maxSessions));
          }

          const lastNumber = workQueue[workQueue.length - 1]?.blockNumber;

          if (!mounted.current || !lastNumber || fromNumber.eqn(1) || ((workQueue.length >= maxSessionsStore) && fromNumber.lt(savedNumber || lastNumber))) {
            break;
          }
        }
      });
    });
  }, []);

  return filtered;
}
