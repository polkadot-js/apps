// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, BlockNumber, EventRecord, Hash, Header } from '@polkadot/types/interfaces';
import { Slash, SessionRewards } from '@polkadot/react-hooks/types';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { useApi, useCacheKey } from '@polkadot/react-hooks';
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
  reward: string;
  sessionIndex: string;
  slashes: SerializedSlash[];
}

function fromJSON (sessions: Serialized[]): SessionRewards[] {
  return sessions.map(({ blockHash, blockNumber, isEventsEmpty, reward, sessionIndex, slashes }): SessionRewards => ({
    blockHash: createType('Hash', blockHash),
    blockNumber: createType('BlockNumber', blockNumber),
    isEventsEmpty,
    reward: createType('Balance', reward),
    sessionIndex: createType('SessionIndex', sessionIndex),
    slashes: slashes.map(({ accountId, amount }): Slash => ({
      accountId: createType('AccountId', accountId),
      amount: createType('Balance', amount)
    }))
  }));
}

function toJSON (sessions: SessionRewards[], maxSessions: number): Serialized[] {
  return sessions.map(({ blockHash, blockNumber, isEventsEmpty, reward, sessionIndex, slashes }): Serialized => ({
    blockHash: blockHash.toHex(),
    blockNumber: blockNumber.toHex(),
    isEventsEmpty,
    reward: reward.toHex(),
    sessionIndex: sessionIndex.toHex(),
    slashes: slashes.map(({ accountId, amount }): SerializedSlash => ({
      accountId: accountId.toString(),
      amount: amount.toHex()
    }))
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
  const results = await api.rpc.state.queryStorage([api.query.session.currentIndex.key()], fromHash, toHash);
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
  const rewards: (Balance | undefined)[] = events.map((info): Balance | undefined => {
    const rewards = info.filter(({ event: { method } }): boolean => method === 'Reward');

    return rewards[0]?.event?.data[0] as Balance;
  });

  return results.map(({ changes: [[, value]] }, index): SessionRewards => ({
    blockHash: headers[index].hash,
    blockNumber: headers[index].number.unwrap(),
    isEventsEmpty: events[index].length === 0,
    reward: rewards[index] || createType('Balance'),
    sessionIndex: createType('SessionIndex', u8aToU8a(
      value.isSome ? value.unwrap() : new Uint8Array([])
    )),
    slashes: slashes[index]
  }));
}

export default function useSessionRewards (maxSessions: number): SessionRewards[] {
  const { api } = useApi();
  const [getCache, setCache] = useCacheKey<Serialized[]>('hooks:sessionSlashes');
  const [filtered, setFiltered] = useState<SessionRewards[]>([]);

  useEffect((): void => {
    let workQueue = fromJSON(getCache() || []);

    setImmediate((): void => {
      api.isReady.then(async (): Promise<void> => {
        const maxSessionsStore = maxSessions + 1; // assuming first is a bust
        const sessionLength = (api.consts.babe?.epochDuration as BlockNumber || new BN(500));
        const count = Math.min(sessionLength.muln(maxSessionsStore).divn(10).toNumber(), 10000);
        const bestHeader = await api.rpc.chain.getHeader();
        let toHash = bestHeader.hash;
        let toNumber = bestHeader.number.unwrap().toBn();
        let fromHash = api.genesisHash;
        let fromNumber = bnMax(toNumber.subn(count), new BN(1));

        while (true) {
          fromHash = await api.rpc.chain.getBlockHash(fromNumber as any);

          const newQueue = await loadSome(api, fromHash, toHash);

          workQueue = mergeResults(workQueue, newQueue);
          toHash = fromHash;
          toNumber = fromNumber;
          fromNumber = bnMax(toNumber.subn(count), new BN(1));

          setCache(toJSON(workQueue, maxSessionsStore));
          setFiltered(workQueue.slice(-maxSessions));

          const lastNumber = workQueue[workQueue.length - 1]?.blockNumber;

          if (!lastNumber || fromNumber.eqn(1) || ((workQueue.length >= maxSessionsStore) && fromNumber.lt(lastNumber))) {
            break;
          }
        }
      });
    });
  }, []);

  return filtered;
}
