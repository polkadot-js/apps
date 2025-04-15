// Copyright 2017-2025 @polkadot/app-staking-next authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { AccountId32, Event } from '@polkadot/types/interfaces';
import type { IEventData } from '@polkadot/types/types';

import React, { useEffect, useMemo, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import RelaySection from './relay.js';

const MAX_EVENTS = 10;

// const getApi = async (url: string) => {
//   const api = await ApiPromise.create({
//     provider: new WsProvider(url)
//   });

//   await api.isReadyOrError;

//   return api;
// };

const commandCenterHandler = async (rcApi: ApiPromise, setRcOutout: React.Dispatch<React.SetStateAction<IRcOutput[]>>): Promise<void> => {
  // const rcApi = await getApi('ws://127.0.0.1:54169');
  // const ahApi = await getApi('ws://127.0.0.1:54175');

  //   const manager = UpdateManager.getInstance();
  // manager.hook();

  // let ahOutput: string[] = [];
  // const rcEvents: string[] = [];
  // const ahEvents: string[] = [];

  await rcApi.rpc.chain.subscribeFinalizedHeads(async (header) => {
    // --- RC:
    // current session index
    const index = await rcApi.query.session.currentIndex();
    // whether the session pallet has a queued validator set within it
    const hasQueuedInSession = await rcApi.query.session.queuedChanged();
    // the range of historical session data that we have in the RC.
    const historicalRange = await rcApi.query.historical.storedRange();

    // whether there is a validator set queued in ah-client. for this we need to display only the id and the length of the set.
    const hasQueuedInClient =
      await rcApi.query.stakingNextAhClient.validatorSet();
      // whether we have already passed a new validator set to session, and therefore in the next session rotation we want to pass this id to AH.
    const hasNextActiveId =
      await rcApi.query.stakingNextAhClient.nextSessionChangesValidators();
      // whether the AhClient pallet is blocked or not, useful for migration signal from the fellowship.
    const isBlocked = await rcApi.query.stakingNextAhClient.isBlocked();

    // Events that we are interested in from RC:
    const eventsOfInterest = (await (await rcApi.at(header.hash.toHex())).query.system.events())
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .map((e) => e.event)
      .filter((e) => {
        const ahClientEvents = (e: IEventData) =>
          e.section === 'stakingNextAhClient';
        const sessionEvents = (e: IEventData) =>
          e.section === 'session' || e.section === 'historical';

        return ahClientEvents(e.data) || sessionEvents(e.data);
      });
      // .map(
      //   (e) =>
      //     `${e.section.toString()}::${e.method.toString()}(${e.data.toString()})`
      // );

    // rcEvents.push(...eventsOfInterest);

    setRcOutout((prev) => {
      const parsedHasQueuedInClient = rcApi.createType('Option<(u32,Vec<AccountId32>)>', hasQueuedInClient);

      return [
        {
          events: eventsOfInterest,
          finalizedBlock: header.number.toNumber(),
          session: {
            hasQueuedInSession: hasQueuedInSession.isTrue,
            historicalRange: historicalRange.isSome ? [historicalRange.unwrap()[0].toNumber(), historicalRange.unwrap()[1].toNumber()] : undefined,
            index: index.toNumber()
          },
          stakingNextAhClient: {
            hasNextActiveId: hasNextActiveId.isEmpty ? undefined : rcApi.createType('Option<u32>', hasNextActiveId).unwrap().toNumber(),
            hasQueuedInClient: parsedHasQueuedInClient.isNone ? undefined : [parsedHasQueuedInClient.unwrap()[0].toNumber(), parsedHasQueuedInClient.unwrap()[1]],
            isBlocked: isBlocked.toHuman() !== 'Not'
          }
        },
        ...prev.slice(0, MAX_EVENTS - 1)];
    });

    // rcOutput = [
    //   'RC:',
    //   `finalized block ${header.number.toNumber()}`,
    //   `RC.session: index=${index.toNumber()}, hasQueuedInSession=${hasQueuedInSession.toString()}, historicalRange=${historicalRange.toString()}`,
    //   `RC.stakingNextAhClient: hasQueuedInClient=${hasQueuedInClient.toString()}, hasNextActiveId=${hasNextActiveId.toString()}, isBlocked=${isBlocked.toString()}`,
    //   `RC.events: ${JSON.stringify(rcEvents)}`,
    //   '----'
    // ];

    // manager.update(rcOutput.concat(ahOutput));
    // rcOutput.concat(ahOutput);
  });

  // AH:
  // await ahApi.rpc.chain.subscribeFinalizedHeads(async (header) => {
  //   // the current planned era
  //   const currentEra = await ahApi.query.staking.currentEra();
  //   // the active era
  //   const activeEra = await ahApi.query.staking.activeEra();
  //   // the starting index of the active era
  //   const erasStartSessionIndex =
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     await ahApi.query.staking.erasStartSessionIndex(activeEra.unwrap().index);

  //   // the basic state of the election provider
  //   const phase = await ahApi.query.multiBlock.currentPhase();
  //   const round = await ahApi.query.multiBlock.round();
  //   const snapshotRange = (
  //     await ahApi.query.multiBlock.pagedVoterSnapshotHash.entries()
  //   )
  //     .map(([k]) => k.args[0])
  //     .sort();
  //   const queuedScore =
  //     await ahApi.query.multiBlockVerifier.queuedSolutionScore();
  //   const signedSubmissions =
  //     await ahApi.query.multiBlockSigned.sortedScores(round);

  //   // Events that we are interested in from RC:
  //   const eventsOfInterest = (await ahApi.query.system.events())
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     .map((e) => e.event)
  //     .filter((e) => {
  //       const election = (e: IEventData) =>
  //         e.section === 'multiBlock' ||
  //         e.section === 'multiBlockVerifier' ||
  //         e.section === 'multiBlockSigned' ||
  //         e.section === 'multiBlockUnsigned';
  //       const rcClient = (e: IEventData) => e.section === 'stakingNextRcClient';
  //       const staking = (e: IEventData) =>
  //         e.section === 'staking' &&
  //         (e.method === 'EraPaid' ||
  //           e.method === 'SessionRotated' ||
  //           e.method === 'PagedElectionProceeded');

  //       return election(e.data) || rcClient(e.data) || staking(e.data);
  //     })
  //     .map(
  //       (e) =>
  //         `${e.section.toString()}::${e.method.toString()}(${e.data.toString()})`
  //     );

  //   ahEvents.push(...eventsOfInterest);

  //   ahOutput = [
  //     'AH:',
  //     `finalized block ${header.number.toNumber()}`,
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     `AH.staking: currentEra=${currentEra.unwrap().toNumber()}, activeEra=${activeEra.unwrap().toString()}, erasStartSessionIndex(${activeEra.unwrap().index.toNumber()})=${erasStartSessionIndex.unwrap().toNumber()}`,
  //     `multiBlock: phase=${phase.toString()}, round=${round.toString()}, snapshotRange=${JSON.stringify(snapshotRange)}, queuedScore=${queuedScore.toString()}, signedSubmissions=${signedSubmissions.toString()}`,
  //     `AH.events: ${JSON.stringify(ahEvents)}`,
  //     '----'
  //   ];

  //   // manager.update(rcOutput.concat(ahOutput));
  //   rcOutput.concat(ahOutput);
  // });
};

export interface IRcOutput {
  finalizedBlock: number,
  session: {
    index: number,
    hasQueuedInSession: boolean,
    historicalRange?: [number, number]
  },
  stakingNextAhClient: {
    isBlocked: boolean
    hasNextActiveId?: number,
    hasQueuedInClient?: [number, AccountId32[]]
  },
  events: Event[]
}

function CommandCenter () {
  const { api } = useApi();
  const [rcOutput, setRcOutput] = useState<IRcOutput[]>([]);

  const rcApi = useMemo(() => api, [api]);

  useEffect(() => {
    commandCenterHandler(rcApi, setRcOutput).catch((e) => console.log(e));
  }, [rcApi]);

  return (
    <>
      <RelaySection rcOutput={rcOutput} />
    </>
  );
}

export default React.memo(CommandCenter);
