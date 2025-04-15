// Copyright 2017-2025 @polkadot/app-staking-next authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32, Event } from '@polkadot/types/interfaces';
import type { IEventData } from '@polkadot/types/types';

import React, { useEffect, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { prodParasPolkadotCommon, prodRelayPolkadot } from '@polkadot/apps-config';
import { useApi } from '@polkadot/react-hooks';

import AssetHubSection from './ah.js';
import RelaySection from './relay.js';

const MAX_EVENTS = 10;

const getApi = async (url: string[]) => {
  const api = await ApiPromise.create({
    provider: new WsProvider(url)
  });

  await api.isReadyOrError;

  return api;
};

const commandCenterHandler = async (
  rcApi: ApiPromise,
  ahApi: ApiPromise,
  setRcOutout: React.Dispatch<React.SetStateAction<IRcOutput[]>>,
  setAhOutout: React.Dispatch<React.SetStateAction<IAhOutput[]>>
): Promise<void> => {
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
      .map((e) => e.event)
      .filter((e) => {
        const ahClientEvents = (e: IEventData) =>
          e.section === 'stakingNextAhClient';
        const sessionEvents = (e: IEventData) =>
          e.section === 'session' || e.section === 'historical';

        return ahClientEvents(e.data) || sessionEvents(e.data);
      });

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
  });

  await ahApi.rpc.chain.subscribeFinalizedHeads(async (header) => {
    // the current planned era
    const currentEra = await ahApi.query.staking.currentEra();
    // the active era
    const activeEra = await ahApi.query.staking.activeEra();
    // the starting index of the active era
    const erasStartSessionIndex = await ahApi.query.staking.erasStartSessionIndex(activeEra.unwrap().index);

    // the basic state of the election provider
    const phase = await ahApi.query.multiBlock.currentPhase();
    const round = await ahApi.query.multiBlock.round();
    const snapshotRange = (
      await ahApi.query.multiBlock.pagedVoterSnapshotHash.entries()
    )
      .map(([k]) => k.args[0])
      .sort();
    const queuedScore =
      await ahApi.query.multiBlockVerifier.queuedSolutionScore();
    const signedSubmissions =
      await ahApi.query.multiBlockSigned.sortedScores(round);

    // Events that we are interested in from RC:
    const eventsOfInterest = (await (await ahApi.at(header.hash.toHex())).query.system.events())
      .map((e) => e.event)
      .filter((e) => {
        const election = (e: IEventData) =>
          e.section === 'multiBlock' ||
          e.section === 'multiBlockVerifier' ||
          e.section === 'multiBlockSigned' ||
          e.section === 'multiBlockUnsigned';
        const rcClient = (e: IEventData) => e.section === 'stakingNextRcClient';
        const staking = (e: IEventData) =>
          e.section === 'staking' &&
          (e.method === 'EraPaid' ||
            e.method === 'SessionRotated' ||
            e.method === 'PagedElectionProceeded');

        return election(e.data) || rcClient(e.data) || staking(e.data);
      });

    setAhOutout((prev) => {
      const parsedQueuedScore = ahApi.createType('Option<SpNposElectionsElectionScore>', queuedScore);

      return [
        {
          events: eventsOfInterest,
          finalizedBlock: header.number.toNumber(),
          multiblock: {
            phase: phase.toString(),
            queuedScore: parsedQueuedScore.isSome ? parsedQueuedScore.unwrap().toString() : null,
            round: ahApi.createType('u32', round).toNumber(),
            signedSubmissions: ahApi.createType('Vec<(AccountId32,SpNposElectionsElectionScore)>', signedSubmissions).length,
            snapshotRange: snapshotRange.map((a) => a.toString())
          },
          staking: {
            activeEra: {
              index: activeEra.unwrap().index.toNumber(),
              start: activeEra.unwrap().toString()
            },
            currentEra: currentEra.unwrap().toNumber(),
            erasStartSessionIndex: erasStartSessionIndex.unwrap().toNumber()
          }
        },
        ...prev.slice(0, MAX_EVENTS - 1)
      ];
    });
  });
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

export interface IAhOutput {
  finalizedBlock: number,
  staking: {
    currentEra: number,
    activeEra: {index: number, start: string},
    erasStartSessionIndex: number
  },
  multiblock: {
    phase: string,
    round: number,
    snapshotRange: string[]
    queuedScore: string|null,
    signedSubmissions: number
  },
  events: Event[]
}

function CommandCenter () {
  const { api, apiEndpoint } = useApi();
  const [rcOutput, setRcOutput] = useState<IRcOutput[]>([]);
  const [ahOutput, setAhOutput] = useState<IAhOutput[]>([]);
  const [ahApi, setAhApi] = useState<ApiPromise>();
  const [rcApi, setRcApi] = useState<ApiPromise>();

  useEffect(() => {
    // Check if it is relay chain
    if (api.tx.stakingNextAhClient) {
      setRcApi(api);
      const ahEndpoint = Object.values(prodParasPolkadotCommon[0].providers) as string[];

      getApi(ahEndpoint).then((ahApi) => setAhApi(ahApi)).catch((e) => console.log(e));
    } else if (api.tx.staking && api.tx.stakingNextRcClient) { // Check if Asset Hub chain
      setAhApi(api);
      const rcEndpoint = Object.values(prodRelayPolkadot.providers).filter((e) => e.startsWith('ws'));

      getApi(rcEndpoint).then((rcApi) => setRcApi(rcApi)).catch((e) => console.log(e));
    }
  }, [api, apiEndpoint?.paraId]);

  useEffect(() => {
    ahApi && rcApi && commandCenterHandler(rcApi, ahApi, setRcOutput, setAhOutput).catch((e) => console.log(e));
  }, [ahApi, rcApi]);

  return (
    <>
      <RelaySection rcOutput={rcOutput} />
      <AssetHubSection ahOutput={ahOutput} />
    </>
  );
}

export default React.memo(CommandCenter);
