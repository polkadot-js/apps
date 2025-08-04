// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32, Event } from '@polkadot/types/interfaces';
import type { IEventData, ITuple } from '@polkadot/types/types';
import type { u32, Vec } from '@polkadot/types-codec';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { createWsEndpoints } from '@polkadot/apps-config';
import { Dropdown, styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import AssetHubSection from './ah.js';
import RelaySection from './relay.js';

const allEndPoints = createWsEndpoints((k, v) => v?.toString() || k);

const MAX_EVENTS = 25;

const getApi = async (url: string[]|string) => {
  const api = await ApiPromise.create({
    provider: new WsProvider(url)
  });

  await api.isReadyOrError;

  return api;
};

export interface IRcOutput {
  finalizedBlock: number,
  session: {
    index: number,
    hasQueuedInSession: boolean,
    historicalRange?: [number, number]
  },
  stakingAhClient: {
    mode: string
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
    erasStartSessionIndex?: number,
    bondedEras: Vec<ITuple<[u32, u32]>>
  },
  rcClient: {
    lastSessionReportEndIndex: string
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
      await rcApi.query.stakingAhClient.validatorSet();
      // whether we have already passed a new validator set to session, and therefore in the next session rotation we want to pass this id to AH.
    const hasNextActiveId =
      await rcApi.query.stakingAhClient.nextSessionChangesValidators();
    // Operating mode of the client.
    const mode = await rcApi.query.stakingAhClient.mode();

    // Events that we are interested in from RC:
    const eventsOfInterest = (await (await rcApi.at(header.hash.toHex())).query.system.events())
      .map((e) => e.event)
      .filter((e) => {
        const ahClientEvents = (e: IEventData) =>
          e.section === 'stakingAhClient';
        const sessionEvents = (e: IEventData) =>
          e.section === 'session' || e.section === 'historical';

        return ahClientEvents(e.data) || sessionEvents(e.data);
      });

    setRcOutout((prev) => {
      const newItem = {
        events: eventsOfInterest,
        finalizedBlock: header.number.toNumber(),
        session: {
          hasQueuedInSession: hasQueuedInSession.isTrue,
          historicalRange: historicalRange.isSome
            ? [historicalRange.unwrap()[0].toNumber(), historicalRange.unwrap()[1].toNumber()] as [number, number]
            : undefined,
          index: index.toNumber()
        },
        stakingAhClient: {
          hasNextActiveId: hasNextActiveId.isEmpty
            ? undefined
            : rcApi.createType('Option<u32>', hasNextActiveId).unwrap().toNumber(),
          hasQueuedInClient: (() => {
            const parsed = rcApi.createType('Option<(u32,Vec<AccountId32>)>', hasQueuedInClient);

            return parsed.isNone ? undefined : [parsed.unwrap()[0].toNumber(), parsed.unwrap()[1]] as [number, AccountId32[]];
          })(),
          mode: mode.toString()
        }
      };

      return [newItem, ...prev]
        .reduce((acc, curr) => {
          if (!acc.find((item) => item.finalizedBlock === curr.finalizedBlock)) {
            acc.push(curr);
          }

          return acc;
        }, [] as typeof prev)
        .slice(0, MAX_EVENTS);
    });
  });

  await ahApi.rpc.chain.subscribeFinalizedHeads(async (header) => {
    // the current planned era
    const currentEra = (await ahApi.query.staking.currentEra()).unwrap();
    // the active era
    const activeEra = (await ahApi.query.staking.activeEra()).unwrap();
    // the starting index of the active era
    const bondedEras = await ahApi.query.staking.bondedEras();
    const activeEraStartSessionIndex = bondedEras.find(([e]) => e.eq(activeEra.index))?.[1];
    // the starting index of the active era
    // const erasStartSessionIndex = await ahApi.query.staking.erasStartSessionIndex(activeEra.unwrap().index);

    // the basic state of the election provider
    const phase = await ahApi.query.multiBlockElection.currentPhase();
    const round = await ahApi.query.multiBlockElection.round();
    const snapshotRange = (
      await ahApi.query.multiBlockElection.pagedVoterSnapshotHash.entries()
    )
      .map(([k]) => k.args[0])
      .sort();
    const queuedScore =
      await ahApi.query.multiBlockElectionVerifier.queuedSolutionScore(round);
    const signedSubmissions =
      await ahApi.query.multiBlockElectionSigned.sortedScores(round);

    // The client
    const lastSessionReportEndIndex = await ahApi.query.stakingRcClient.lastSessionReportEndingIndex();

    // Events that we are interested in from RC:
    const eventsOfInterest = (await (await ahApi.at(header.hash.toHex())).query.system.events())
      .map((e) => e.event)
      .filter((e) => {
        const election = (e: IEventData) => e.section === 'multiBlockElection' || e.section === 'multiBlockElectionVerifier' || e.section === 'multiBlockElectionSigned' || e.section === 'multiBlockElectionUnsigned';
        const rcClient = (e: IEventData) => e.section === 'stakingRcClient';
        const staking = (e: IEventData) => e.section === 'staking' && (e.method === 'EraPaid' || e.method === 'SessionRotated' || e.method === 'PagedElectionProceeded');

        return election(e.data) || rcClient(e.data) || staking(e.data);
      });

    setAhOutout((prev) => {
      const parsedQueuedScore = ahApi.createType('Option<SpNposElectionsElectionScore>', queuedScore);

      const newItem = {
        events: eventsOfInterest,
        finalizedBlock: header.number.toNumber(),
        multiblock: {
          phase: phase.toString(),
          queuedScore: parsedQueuedScore.isSome ? parsedQueuedScore.unwrap().toString() : null,
          round: ahApi.createType('u32', round).toNumber(),
          signedSubmissions: ahApi.createType(
            'Vec<(AccountId32,SpNposElectionsElectionScore)>',
            signedSubmissions
          ).length,
          snapshotRange: snapshotRange.map((a) => a.toString())
        },
        rcClient: { lastSessionReportEndIndex: lastSessionReportEndIndex.toString() },
        staking: {
          activeEra: {
            index: activeEra.index.toNumber(),
            start: activeEra.toString()
          },
          bondedEras,
          currentEra: currentEra.toNumber(),
          erasStartSessionIndex: activeEraStartSessionIndex?.toNumber()
        }
      };

      return [newItem, ...prev]
        .reduce((acc, curr) => {
          if (!acc.find((item) => item.finalizedBlock === curr.finalizedBlock)) {
            acc.push(curr);
          }

          return acc;
        }, [] as typeof prev)
        .slice(0, MAX_EVENTS);
    });
  });
};

function CommandCenter () {
  const { api, apiEndpoint, apiUrl } = useApi();

  const [rcOutput, setRcOutput] = useState<IRcOutput[]>([]);
  const [ahOutput, setAhOutput] = useState<IAhOutput[]>([]);

  const [rcUrl, setRcUrl] = useState<string|undefined>(undefined);
  const [ahUrl, setAhUrl] = useState<string|undefined>(undefined);

  const [ahApi, setAhApi] = useState<ApiPromise>();
  const [rcApi, setRcApi] = useState<ApiPromise>();

  // Check if it is relay chain
  const isRelayChain = useMemo(() => api.tx.stakingAhClient, [api.tx.stakingAhClient]);

  const rcEndPoints = useMemo(() => {
    return (isRelayChain
      ? apiEndpoint?.providers
      : apiEndpoint?.valueRelay) || [];
  }, [apiEndpoint?.providers, apiEndpoint?.valueRelay, isRelayChain]);

  const ahEndPoints: string[] = useMemo(() => {
    if (isRelayChain) {
      return allEndPoints.find(({ genesisHashRelay, paraId }) =>
        paraId === 1000 && genesisHashRelay === api.genesisHash.toHex()
      )?.providers || [];
    }

    return apiEndpoint?.providers || [];
  }, [api.genesisHash, apiEndpoint?.providers, isRelayChain]);

  const rcEndPointOptions = useRef(rcEndPoints.map((e) => ({ text: e, value: e })));
  const ahEndPointOptions = useRef(ahEndPoints.map((e) => ({ text: e, value: e })));

  const _onSelectAhUrl = useCallback((newAhUrl: string) => {
    if (newAhUrl !== ahUrl) {
      ahApi?.disconnect().catch(console.log);
      setAhUrl(newAhUrl);
    }
  }, [ahApi, ahUrl]);

  const _onSelectRcUrl = useCallback((newRcUrl: string) => {
    if (newRcUrl !== rcUrl) {
      rcApi?.disconnect().catch(console.log);
      setRcUrl(newRcUrl);
    }
  }, [rcApi, rcUrl]);

  useEffect(() => {
    if (isRelayChain) {
      setRcUrl(apiUrl);
      const ahUrl = ahEndPoints.at(0);

      setAhUrl(ahUrl);
    } else {
      setAhUrl(apiUrl);
      const rcUrl = rcEndPoints.at(0);

      setRcUrl(rcUrl);
    }
  }, [ahEndPoints, apiUrl, isRelayChain, rcEndPoints]);

  useEffect(() => {
    setRcApi(undefined);
    setAhApi(undefined);
    setRcOutput([]);
    setAhOutput([]);

    if (isRelayChain) {
      setRcApi(api);

      if (ahUrl) {
        getApi(ahUrl).then((ahApi) => setAhApi(ahApi)).catch(console.log);
      }
    } else if (api.tx.staking && api.tx.stakingRcClient) { // Check if Asset Hub chain
      setAhApi(api);

      if (rcUrl) {
        getApi(rcUrl).then((rcApi) => setRcApi(rcApi)).catch(console.log);
      }
    }
  }, [ahUrl, api, isRelayChain, rcUrl]);

  useEffect(() => {
    ahApi && rcApi && commandCenterHandler(rcApi, ahApi, setRcOutput, setAhOutput).catch(console.log);
  }, [ahApi, rcApi]);

  return (
    <StyledDiv>
      <RelaySection
        isRelayChain={!!isRelayChain}
        rcApi={rcApi}
        rcOutput={rcOutput}
        rcUrl={rcUrl || ''}
      >
        <Dropdown
          defaultValue={rcUrl}
          isButton
          isDisabled={!!isRelayChain}
          onChange={_onSelectRcUrl}
          options={rcEndPointOptions.current}
        />
      </RelaySection>
      <AssetHubSection
        ahApi={ahApi}
        ahOutput={ahOutput}
        ahUrl={ahUrl || ''}
        isRelayChain={!!isRelayChain}
      >
        <Dropdown
          defaultValue={ahUrl}
          isButton
          isDisabled={!isRelayChain}
          onChange={_onSelectAhUrl}
          options={ahEndPointOptions.current}
        />
      </AssetHubSection>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media screen and (max-width: 1200px){
    grid-template-columns: repeat(1, 1fr);
  }

  .ui--Spinner {
    margin-top: 4rem;
  }

  .ui {
    margin-left: 0.5rem !important;
    width: 20rem !important;
  }
`;

export default React.memo(CommandCenter);
