// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, BlockNumber, EventRecord, Hash, Header } from '@polkadot/types/interfaces';
import { Slash, SessionRewards } from './types';

import BN from 'bn.js';
import { useContext, useEffect, useState } from 'react';
import store from 'store';
import { ApiPromise } from '@polkadot/api';
import { ApiContext } from '@polkadot/react-api';
import { createType } from '@polkadot/types';
import { bnMax, u8aToU8a } from '@polkadot/util';

interface SlashSer {
  accountId: string;
  amount: string;
}

interface SessionResultSer {
  blockHash: string;
  blockNumber: string;
  isEventsEmpty: boolean;
  reward: string;
  sessionIndex: string;
  slashes: SlashSer[];
}

// assuming 4 hrs sessions, we grab results for 10 days (+2 for at-start throw-away)
const MAX_SESSIONS = 10 * (24 / 4) + 2;

function getStorage (storageKey: string): SessionRewards[] {
  const sessions: SessionResultSer[] = store.get(storageKey, []);

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

function setStorage (storageKey: string, sessions: SessionRewards[]): SessionResultSer[] {
  return store.set(
    storageKey,
    sessions
      .map(({ blockHash, blockNumber, isEventsEmpty, reward, sessionIndex, slashes }): SessionResultSer => ({
        blockHash: blockHash.toHex(),
        blockNumber: blockNumber.toHex(),
        isEventsEmpty,
        reward: reward.toHex(),
        sessionIndex: sessionIndex.toHex(),
        slashes: slashes.map(({ accountId, amount }): SlashSer => ({
          accountId: accountId.toString(),
          amount: amount.toHex()
        }))
      }))
      .slice(0, MAX_SESSIONS + 1)
  );
}

function mergeResults (sessions: SessionRewards[], newSessions: SessionRewards[]): SessionRewards[] {
  const tmp = sessions
    .concat(newSessions)
    .sort((a, b): number => a.blockNumber.cmp(b.blockNumber));

  return tmp.filter(({ sessionIndex }, index): boolean =>
    index === 0
      // for the first, always use it
      ? true
      // if the prev has the same sessionIndex, ignore this one
      : !tmp[index - 1].sessionIndex.eq(sessionIndex)
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
        .catch((): EventRecord[] => []) // undecodable may throw
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
    sessionIndex: createType('SessionIndex', u8aToU8a(value.unwrap())),
    slashes: slashes[index]
  }));
}

export default function useSessionSlashes (maxSessions = MAX_SESSIONS): SessionRewards[] {
  const { api } = useContext(ApiContext);
  const STORAGE_KEY = `hooks:sessionSlashes:${api.genesisHash}`;
  const [results, setResults] = useState<SessionRewards[]>(getStorage(STORAGE_KEY));
  const [filtered, setFiltered] = useState<SessionRewards[]>([]);

  useEffect((): void => {
    let workQueue = results;

    api.isReady.then(async (): Promise<void> => {
      const sessionLength = (api.consts.babe?.epochDuration as BlockNumber || new BN(500));
      const count = sessionLength.muln(maxSessions).divn(10).toNumber();
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

        setStorage(STORAGE_KEY, workQueue);
        setResults(workQueue);

        if (fromNumber.eqn(1) || (workQueue.length > maxSessions)) {
          break;
        }
      }
    });
  }, []);

  useEffect((): void => {
    setFiltered(results.filter(({ isEventsEmpty }): boolean => !isEventsEmpty));
  }, [results]);

  return filtered;
}
