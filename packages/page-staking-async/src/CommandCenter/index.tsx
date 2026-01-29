// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { AccountId32, Event, Hash } from '@polkadot/types/interfaces';
import type { FrameSupportDispatchPerDispatchClassWeight, PolkadotRuntimeParachainsConfigurationHostConfiguration } from '@polkadot/types/lookup';
import type { IEventData, ITuple } from '@polkadot/types/types';
import type { u32, Vec } from '@polkadot/types-codec';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button, Dropdown, Input, MarkWarning, styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { getApi } from '@polkadot/react-hooks/ctx/StakingAsync';
import { formatBalance } from '@polkadot/util';

import AssetHubSection from './ah.js';
import RelaySection from './relay.js';

// Enhanced event type with metadata
export interface EnhancedEvent {
  event: Event;
  blockNumber: number;
  blockHash: string;
  weight?: string;
}

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
    hasQueuedInClient?: [number, AccountId32[]],
    validatorPoints: number
  },
  staking: {
    forceEra?: string,
    validatorCount?: number,
    electionPhase?: string
  },
  parachainConfig?: {
    maxDownwardMessageSize: number,
    maxUpwardMessageSize: number
  }
}

export interface IAhOutput {
  finalizedBlock: number,
  staking: {
    currentEra: number,
    activeEra: {index: number, start: string, duration?: string},
    erasStartSessionIndex?: number,
    bondedEras: Vec<ITuple<[u32, u32]>>,
    unprunedEras: string,
    validatorCount?: number,
    validatorCandidates?: number,
    nominatorCandidates?: number,
    maxValidatorsCount?: number,
    maxNominatorsCount?: number,
    minNominatorBond?: string,
    minValidatorBond?: string,
    minNominatorActiveStake?: string,
    forcing?: string
  },
  rcClient: {
    lastSessionReportEndIndex: string,
    lastSessionIndex: number,
    eraDepth?: number
  },
  multiblock: {
    phase: string,
    round: number,
    snapshotRange: string[]
    queuedScore: string|null,
    signedSubmissions: number
  },
  bagsList?: {
    allNodes: number,
    lock: string
  }
}

// Filter functions for relevant events
const filterRcEvents = (e: IEventData): boolean => {
  const ahClientEvents = (e: IEventData) =>
    e.section === 'stakingAhClient';
  const sessionEvents = (e: IEventData) =>
    e.section === 'session' || e.section === 'historical';

  return ahClientEvents(e) || sessionEvents(e);
};

const filterAhEvents = (e: IEventData): boolean => {
  const election = (e: IEventData) =>
    e.section === 'multiBlockElection' ||
    e.section === 'multiBlockElectionVerifier' ||
    e.section === 'multiBlockElectionSigned' ||
    e.section === 'multiBlockElectionUnsigned';
  const rcClient = (e: IEventData) => e.section === 'stakingRcClient';
  const staking = (e: IEventData) =>
    e.section === 'staking' &&
    (e.method === 'EraPaid' ||
      e.method === 'SessionRotated' ||
      e.method === 'PagedElectionProceeded');

  return election(e) || rcClient(e) || staking(e);
};

const commandCenterHandler = async (
  rcApi: ApiPromise,
  ahApi: ApiPromise,
  setRcOutput: React.Dispatch<React.SetStateAction<IRcOutput | undefined>>,
  setAhOutput: React.Dispatch<React.SetStateAction<IAhOutput | undefined>>,
  setRcEvents: React.Dispatch<React.SetStateAction<EnhancedEvent[]>>,
  setAhEvents: React.Dispatch<React.SetStateAction<EnhancedEvent[]>>
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

    // Staking info from RC if available
    const forceEra = rcApi.query.staking?.forceEra ? await rcApi.query.staking.forceEra() : undefined;
    const validatorCount = rcApi.query.staking?.validatorCount ? await rcApi.query.staking.validatorCount() : undefined;
    const electionPhase = rcApi.query.electionProviderMultiPhase?.currentPhase ? await rcApi.query.electionProviderMultiPhase.currentPhase() : undefined;

    // Validator points
    const validatorPointsKeys = await rcApi.query.stakingAhClient.validatorPoints.keys();

    // Parachain config
    let parachainConfig;

    try {
      const configuration = await rcApi.query.configuration.activeConfig() as PolkadotRuntimeParachainsConfigurationHostConfiguration;

      parachainConfig = {
        maxDownwardMessageSize: configuration.maxDownwardMessageSize?.toNumber() || 0,
        maxUpwardMessageSize: configuration.maxUpwardMessageSize?.toNumber() || 0
      };
    } catch {
      parachainConfig = undefined;
    }

    // Events that we are interested in from RC:
    const eventsOfInterest = (await (await rcApi.at(header.hash.toHex())).query.system.events())
      .map((e) => e.event)
      .filter((e) => filterRcEvents(e.data));

    // Wrap events with metadata
    const enhancedEvents: EnhancedEvent[] = eventsOfInterest.map((event) => ({
      blockHash: header.hash.toString(),
      blockNumber: header.number.toNumber(),
      event
    }));

    setRcOutput({
      finalizedBlock: header.number.toNumber(),
      parachainConfig,
      session: {
        hasQueuedInSession: hasQueuedInSession.isTrue,
        historicalRange: historicalRange.isSome
          ? [historicalRange.unwrap()[0].toNumber(), historicalRange.unwrap()[1].toNumber()] as [number, number]
          : undefined,
        index: index.toNumber()
      },
      staking: {
        electionPhase: electionPhase?.toString(),
        forceEra: forceEra?.toString(),
        validatorCount: validatorCount?.toNumber()
      },
      stakingAhClient: {
        hasNextActiveId: hasNextActiveId.isEmpty
          ? undefined
          : rcApi.createType('Option<u32>', hasNextActiveId).unwrap().toNumber(),
        hasQueuedInClient: (() => {
          const parsed = rcApi.createType('Option<(u32,Vec<AccountId32>)>', hasQueuedInClient);

          return parsed.isNone ? undefined : [parsed.unwrap()[0].toNumber(), parsed.unwrap()[1]] as [number, AccountId32[]];
        })(),
        mode: mode.toString(),
        validatorPoints: validatorPointsKeys.length
      }
    });

    if (enhancedEvents.length > 0) {
      setRcEvents(enhancedEvents);
    }
  });

  await ahApi.rpc.chain.subscribeFinalizedHeads(async (header) => {
    // the current planned era
    const currentEra = (await ahApi.query.staking.currentEra()).unwrap().toNumber();
    // the active era
    const activeEra = (await ahApi.query.staking.activeEra()).unwrap();
    const activeEraDuration = activeEra.start.isSome
      ? (() => {
        const startTime = activeEra.start.unwrap().toNumber();
        const durationMs = Date.now() - startTime;
        const hours = Math.floor(durationMs / 3600000);
        const minutes = Math.floor((durationMs % 3600000) / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      })()
      : undefined;

    // the starting index of the active era
    const bondedEras = await ahApi.query.staking.bondedEras();
    const activeEraStartSessionIndex = bondedEras.find(([e]) => e.eq(activeEra.index))?.[1];

    // Unpruned eras
    const unprunedEras = ahApi.query.staking.eraPruningState
      ? (await ahApi.query.staking.eraPruningState.entries()).map(([k]) => k.args[0]).sort().join(', ')
      : 'unimplemented!';

    // Additional staking info
    const validatorCount = ahApi.query.staking.validatorCount ? await ahApi.query.staking.validatorCount() : undefined;
    const validatorCandidates = ahApi.query.staking.counterForValidators ? await ahApi.query.staking.counterForValidators() : undefined;
    const nominatorCandidates = ahApi.query.staking.counterForNominators ? await ahApi.query.staking.counterForNominators() : undefined;
    const maxValidatorsCount = ahApi.query.staking.maxValidatorsCount ? await ahApi.query.staking.maxValidatorsCount() : undefined;
    const maxNominatorsCount = ahApi.query.staking.maxNominatorsCount ? await ahApi.query.staking.maxNominatorsCount() : undefined;
    const minNominatorBond = ahApi.query.staking.minNominatorBond ? await ahApi.query.staking.minNominatorBond() : undefined;
    const minValidatorBond = ahApi.query.staking.minValidatorBond ? await ahApi.query.staking.minValidatorBond() : undefined;
    const minNominatorActiveStake = ahApi.query.staking.minimumActiveStake ? await ahApi.query.staking.minimumActiveStake() : undefined;
    const forcing = ahApi.query.staking.forceEra ? await ahApi.query.staking.forceEra() : undefined;

    // the basic state of the election provider
    const phase = await ahApi.query.multiBlockElection.currentPhase();
    const round = await ahApi.query.multiBlockElection.round();
    const snapshotRange = (
      await ahApi.query.multiBlockElection.pagedVoterSnapshotHash.entries()
    )
      .map(([k]) => k.args[1])
      .sort();
    const queuedScore =
      await ahApi.query.multiBlockElectionVerifier.queuedSolutionScore(round);
    const signedSubmissions =
      await ahApi.query.multiBlockElectionSigned.sortedScores(round);

    // The client
    const lastSessionReportEndIndexRaw = await ahApi.query.stakingRcClient.lastSessionReportEndingIndex();
    const lastSessionReportEndIndex = ahApi.createType('Option<BlockNumber>', lastSessionReportEndIndexRaw);
    const lastSessionIndex = lastSessionReportEndIndex.isSome ? lastSessionReportEndIndex.unwrap().toNumber() + 1 : 0;
    const eraDepth = activeEraStartSessionIndex ? lastSessionIndex - activeEraStartSessionIndex.toNumber() : undefined;

    // Bags list
    let bagsList;

    try {
      const allNodes = await ahApi.query.voterList.counterForListNodes();
      const lock = await ahApi.query.voterList.lock();

      bagsList = {
        allNodes: allNodes.toNumber(),
        lock: lock.toU8a().toString()
      };
    } catch {
      bagsList = undefined;
    }

    // Events that we are interested in from AH:
    const eventsOfInterest = (await (await ahApi.at(header.hash.toHex())).query.system.events())
      .map((e) => e.event)
      .filter((e) => filterAhEvents(e.data));

    // Get block weight
    const weight = await (await ahApi.at(header.hash)).query.system.blockWeight();

    const formatWeight = (w: FrameSupportDispatchPerDispatchClassWeight) => {
      const normalRef = w.normal?.refTime?.toBigInt() || 0n;
      const operationalRef = w.operational?.refTime?.toBigInt() || 0n;
      const mandatoryRef = w.mandatory?.refTime?.toBigInt() || 0n;
      const totalRef = normalRef + operationalRef + mandatoryRef;

      const normalProof = w.normal?.proofSize?.toBigInt() || 0n;
      const operationalProof = w.operational?.proofSize?.toBigInt() || 0n;
      const mandatoryProof = w.mandatory?.proofSize?.toBigInt() || 0n;
      const totalProof = normalProof + operationalProof + mandatoryProof;

      return `${(Number(totalRef) / 1_000_000_000_000).toFixed(2)}s / ${(Number(totalProof) / 1024).toFixed(0)}KB`;
    };

    // Wrap events with metadata including weight
    const enhancedEvents: EnhancedEvent[] = eventsOfInterest.map((event) => ({
      blockHash: header.hash.toString(),
      blockNumber: header.number.toNumber(),
      event,
      weight: formatWeight(weight)
    }));

    const parsedQueuedScore = ahApi.createType('Option<SpNposElectionsElectionScore>', queuedScore);
    const formattedQueuedScore = parsedQueuedScore.isSome
      ? (() => {
        const score = parsedQueuedScore.unwrap();
        const minimalStake = score.minimalStake?.toString() || '0';
        const formattedMinStake = formatBalance(minimalStake, { forceUnit: '-', withSi: true });

        return `minStake: ${formattedMinStake}, ...`;
      })()
      : null;

    // Format phase to be more readable (e.g., "Unsigned(1)" instead of {"unsigned":1})
    const formattedPhase = (() => {
      const phaseStr = phase.toString();

      try {
        const phaseJson = JSON.parse(phaseStr) as Record<string, string>;

        if (typeof phaseJson === 'object' && phaseJson !== null) {
          const key = Object.keys(phaseJson)[0];
          const value = phaseJson[key];

          return `${key.charAt(0).toUpperCase() + key.slice(1)}(${value})`;
        }
      } catch {
        // If not JSON, return as is
      }

      return phaseStr;
    })();

    setAhOutput({
      bagsList,
      finalizedBlock: header.number.toNumber(),
      multiblock: {
        phase: formattedPhase,
        queuedScore: formattedQueuedScore,
        round: ahApi.createType('u32', round).toNumber(),
        signedSubmissions: ahApi.createType(
          'Vec<(AccountId32,SpNposElectionsElectionScore)>',
          signedSubmissions
        ).length,
        snapshotRange: snapshotRange.map((a) => a.toString())
      },
      rcClient: {
        eraDepth,
        lastSessionIndex,
        lastSessionReportEndIndex: lastSessionReportEndIndex.isSome ? lastSessionReportEndIndex.unwrap().toString() : '0'
      },
      staking: {
        activeEra: {
          duration: activeEraDuration,
          index: activeEra.index.toNumber(),
          start: activeEra.toString()
        },
        bondedEras,
        currentEra,
        erasStartSessionIndex: activeEraStartSessionIndex?.toNumber(),
        forcing: forcing?.toString(),
        maxNominatorsCount: maxNominatorsCount?.isSome ? maxNominatorsCount.unwrap().toNumber() : undefined,
        maxValidatorsCount: maxValidatorsCount?.isSome ? maxValidatorsCount.unwrap().toNumber() : undefined,
        minNominatorActiveStake: minNominatorActiveStake?.toString(),
        minNominatorBond: minNominatorBond?.toString(),
        minValidatorBond: minValidatorBond?.toString(),
        nominatorCandidates: nominatorCandidates?.toNumber(),
        unprunedEras,
        validatorCandidates: validatorCandidates?.toNumber(),
        validatorCount: validatorCount?.toNumber()
      }
    });

    if (enhancedEvents.length > 0) {
      setAhEvents(enhancedEvents);
    }
  });
};

interface Props {
  ahApi?: ApiPromise
  rcApi?: ApiPromise
  isRelayChain: boolean
  rcEndPoints: string[]
  ahEndPoints: string[]
}

function CommandCenter ({ ahApi: initialAhApi, ahEndPoints, isRelayChain, rcApi: initialRcApi, rcEndPoints }: Props) {
  const { api, apiUrl } = useApi();

  const [rcOutput, setRcOutput] = useState<IRcOutput | undefined>(undefined);
  const [ahOutput, setAhOutput] = useState<IAhOutput | undefined>(undefined);
  const [rcEvents, setRcEvents] = useState<EnhancedEvent[]>([]);
  const [ahEvents, setAhEvents] = useState<EnhancedEvent[]>([]);

  const [rcUrl, setRcUrl] = useState<string|undefined>(undefined);
  const [ahUrl, setAhUrl] = useState<string|undefined>(undefined);

  const [ahApi, setAhApi] = useState<ApiPromise|undefined>(initialAhApi);
  const [rcApi, setRcApi] = useState<ApiPromise|undefined>(initialRcApi);

  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [rcLowestBlock, setRcLowestBlock] = useState<number | null>(null);
  const [ahLowestBlock, setAhLowestBlock] = useState<number | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<{ rc: number; ah: number } | null>(null);

  const [customRcUrl, setCustomRcUrl] = useState<string>('ws://127.0.0.1:9944');
  const [customAhUrl, setCustomAhUrl] = useState<string>('ws://127.0.0.1:9944');
  const [showCustomRcInput, setShowCustomRcInput] = useState(false);
  const [showCustomAhInput, setShowCustomAhInput] = useState(false);

  const CUSTOM_OPTION = 'custom';
  const rcEndPointOptions = useRef([...rcEndPoints.map((e) => ({ text: e, value: e })), { text: 'Custom endpoint...', value: CUSTOM_OPTION }]);
  const ahEndPointOptions = useRef([...ahEndPoints.map((e) => ({ text: e, value: e })), { text: 'Custom endpoint...', value: CUSTOM_OPTION }]);

  // Load historical events from RC
  const loadRcHistoricalEvents = useCallback(async (blocksToLoad: number) => {
    if (!rcApi) {
      return;
    }

    let currentBlockHash: Hash;

    if (rcLowestBlock === null) {
      const finalizedHead = await rcApi.rpc.chain.getFinalizedHead();

      currentBlockHash = finalizedHead;
    } else if (rcLowestBlock === 0) {
      return;
    } else {
      currentBlockHash = await rcApi.rpc.chain.getBlockHash(rcLowestBlock);
    }

    let blocksProcessed = 0;

    while (blocksProcessed < blocksToLoad) {
      try {
        const block = await rcApi.rpc.chain.getBlock(currentBlockHash);
        const blockNumber = block.block.header.number.toNumber();

        if (blockNumber === 0) {
          setRcLowestBlock(0);
          break;
        }

        const events = await (await rcApi.at(currentBlockHash)).query.system.events();
        const relevantEvents = events
          .map((e) => e.event)
          .filter((e) => filterRcEvents(e.data));

        if (relevantEvents.length > 0) {
          const enhancedEvents: EnhancedEvent[] = relevantEvents.map((event) => ({
            blockHash: currentBlockHash.toString(),
            blockNumber,
            event
          }));

          setRcEvents((prev) => {
            // Insert new events and sort by block number (highest first)
            const combined = [...prev, ...enhancedEvents];

            return combined.sort((a, b) => b.blockNumber - a.blockNumber);
          });
        }

        setRcLowestBlock(blockNumber - 1);
        currentBlockHash = block.block.header.parentHash;
        blocksProcessed++;

        // Update progress
        const remaining = blocksToLoad - blocksProcessed;

        setLoadingProgress((prev) => ({ ah: prev?.ah ?? 0, rc: remaining }));
      } catch (error) {
        console.error(`RC: Error at block ${currentBlockHash.toHex()}:`, error);
        break;
      }
    }
  }, [rcApi, rcLowestBlock]);

  // Load historical events from AH
  const loadAhHistoricalEvents = useCallback(async (blocksToLoad: number) => {
    if (!ahApi) {
      return;
    }

    let currentBlockHash: Hash;

    if (ahLowestBlock === null) {
      const finalizedHead = await ahApi.rpc.chain.getFinalizedHead();

      currentBlockHash = finalizedHead;
    } else if (ahLowestBlock === 0) {
      return;
    } else {
      currentBlockHash = await ahApi.rpc.chain.getBlockHash(ahLowestBlock);
    }

    let blocksProcessed = 0;

    while (blocksProcessed < blocksToLoad) {
      try {
        const block = await ahApi.rpc.chain.getBlock(currentBlockHash);
        const blockNumber = block.block.header.number.toNumber();

        if (blockNumber === 0) {
          setAhLowestBlock(0);
          break;
        }

        const events = await (await ahApi.at(currentBlockHash)).query.system.events();
        const relevantEvents = events
          .map((e) => e.event)
          .filter((e) => filterAhEvents(e.data));

        if (relevantEvents.length > 0) {
          // Get block weight
          const weight = await (await ahApi.at(currentBlockHash)).query.system.blockWeight();

          const formatWeight = (w: FrameSupportDispatchPerDispatchClassWeight) => {
            const normalRef = w.normal?.refTime?.toBigInt() || 0n;
            const operationalRef = w.operational?.refTime?.toBigInt() || 0n;
            const mandatoryRef = w.mandatory?.refTime?.toBigInt() || 0n;
            const totalRef = normalRef + operationalRef + mandatoryRef;

            const normalProof = w.normal?.proofSize?.toBigInt() || 0n;
            const operationalProof = w.operational?.proofSize?.toBigInt() || 0n;
            const mandatoryProof = w.mandatory?.proofSize?.toBigInt() || 0n;
            const totalProof = normalProof + operationalProof + mandatoryProof;

            return `${(Number(totalRef) / 1_000_000_000_000).toFixed(2)}s / ${(Number(totalProof) / 1024).toFixed(0)}KB`;
          };

          const enhancedEvents: EnhancedEvent[] = relevantEvents.map((event) => ({
            blockHash: currentBlockHash.toString(),
            blockNumber,
            event,
            weight: formatWeight(weight)
          }));

          setAhEvents((prev) => {
            // Insert new events and sort by block number (highest first)
            const combined = [...prev, ...enhancedEvents];

            return combined.sort((a, b) => b.blockNumber - a.blockNumber);
          });
        }

        setAhLowestBlock(blockNumber - 1);
        currentBlockHash = block.block.header.parentHash;
        blocksProcessed++;

        // Update progress
        const remaining = blocksToLoad - blocksProcessed;

        setLoadingProgress((prev) => ({ ah: remaining, rc: prev?.rc ?? 0 }));
      } catch (error) {
        console.error(`AH: Error at block ${currentBlockHash.toHex()}:`, error);
        break;
      }
    }
  }, [ahApi, ahLowestBlock]);

  // Load historical events (600 blocks at a time)
  const _loadHistoricalEvents = useCallback(async () => {
    if (isLoadingHistory || (!rcApi && !ahApi)) {
      return;
    }

    setIsLoadingHistory(true);
    setLoadingProgress({ ah: 600, rc: 600 });

    try {
      await Promise.all([
        loadRcHistoricalEvents(600),
        loadAhHistoricalEvents(600)
      ]);

      console.log('Historical events loaded');
    } catch (error) {
      console.error('Error loading historical events:', error);
    } finally {
      setIsLoadingHistory(false);
      setLoadingProgress(null);
    }
  }, [isLoadingHistory, rcApi, ahApi, loadRcHistoricalEvents, loadAhHistoricalEvents]);

  const _onSelectAhUrl = useCallback((newAhUrl: string) => {
    if (newAhUrl === CUSTOM_OPTION) {
      setShowCustomAhInput(true);
    } else if (newAhUrl !== ahUrl) {
      ahApi?.disconnect().catch(console.log);
      setShowCustomAhInput(false);
      setAhUrl(newAhUrl);
    }
  }, [ahApi, ahUrl]);

  const _onSelectRcUrl = useCallback((newRcUrl: string) => {
    if (newRcUrl === CUSTOM_OPTION) {
      setShowCustomRcInput(true);
    } else if (newRcUrl !== rcUrl) {
      rcApi?.disconnect().catch(console.log);
      setShowCustomRcInput(false);
      setRcUrl(newRcUrl);
    }
  }, [rcApi, rcUrl]);

  const _onCustomRcUrlChange = useCallback((value: string) => {
    setCustomRcUrl(value);
  }, []);

  const _onCustomAhUrlChange = useCallback((value: string) => {
    setCustomAhUrl(value);
  }, []);

  const _onApplyCustomRcUrl = useCallback(() => {
    if (customRcUrl?.trim()) {
      rcApi?.disconnect().catch(console.log);
      setRcUrl(customRcUrl.trim());
      setShowCustomRcInput(false);
    }
  }, [customRcUrl, rcApi]);

  const _onApplyCustomAhUrl = useCallback(() => {
    if (customAhUrl?.trim()) {
      ahApi?.disconnect().catch(console.log);
      setAhUrl(customAhUrl.trim());
      setShowCustomAhInput(false);
    }
  }, [customAhUrl, ahApi]);

  useEffect(() => {
    if (isRelayChain) {
      setRcUrl(apiUrl);
      const ahUrl = ahEndPoints.at(Math.floor(Math.random() * ahEndPoints.length));

      setAhUrl(ahUrl);
    } else {
      setAhUrl(apiUrl);
      const rcUrl = rcEndPoints.at(Math.floor(Math.random() * rcEndPoints.length));

      setRcUrl(rcUrl);
    }
  }, [ahEndPoints, apiUrl, isRelayChain, rcEndPoints]);

  useEffect(() => {
    setRcApi(undefined);
    setAhApi(undefined);
    setRcOutput(undefined);
    setAhOutput(undefined);
    setRcEvents([]);
    setAhEvents([]);

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
    ahApi && rcApi && commandCenterHandler(rcApi, ahApi, setRcOutput, setAhOutput, setRcEvents, setAhEvents).catch(console.log);
  }, [ahApi, rcApi]);

  // Auto-load 600 blocks on page load
  useEffect(() => {
    if (ahApi && rcApi && rcLowestBlock === null && ahLowestBlock === null) {
      _loadHistoricalEvents().catch(console.error);
    }
  }, [ahApi, rcApi, rcLowestBlock, ahLowestBlock, _loadHistoricalEvents]);

  return (
    <StyledDiv>
      <StyledWarningBanner>
        <MarkWarning content='This page is for developer debugging only.' />
      </StyledWarningBanner>
      <StyledButtonContainer>
        <Button
          icon='history'
          isDisabled={isLoadingHistory || (!rcApi && !ahApi)}
          label='Load 600 Blocks History'
          onClick={_loadHistoricalEvents}
        />
        {loadingProgress && (
          <div className='history-info progress'>
            Loading historical events... RC: {loadingProgress.rc} blocks left | AH: {loadingProgress.ah} blocks left
          </div>
        )}
        {!loadingProgress && (rcLowestBlock !== null || ahLowestBlock !== null) && (
          <div className='history-info'>
            {rcLowestBlock !== null && `RC: Indexed to Block #${rcLowestBlock}`}
            {rcLowestBlock !== null && ahLowestBlock !== null && ' | '}
            {ahLowestBlock !== null && `AH: Indexed to Block #${ahLowestBlock}`}
          </div>
        )}
      </StyledButtonContainer>
      <RelaySection
        isRelayChain={!!isRelayChain}
        rcApi={rcApi}
        rcEvents={rcEvents}
        rcOutput={rcOutput}
        rcUrl={rcUrl || ''}
      >
        <StyledEndpointControls>
          <Dropdown
            defaultValue={rcUrl}
            isButton
            isDisabled={!!isRelayChain}
            onChange={_onSelectRcUrl}
            options={rcEndPointOptions.current}
          />
          {showCustomRcInput && !isRelayChain && (
            <StyledCustomInput>
              <Input
                autoFocus
                label='Custom RC Endpoint'
                onChange={_onCustomRcUrlChange}
                placeholder='wss://your-relay-chain-endpoint.com'
                value={customRcUrl}
              />
              <Button
                label='Connect'
                onClick={_onApplyCustomRcUrl}
              />
            </StyledCustomInput>
          )}
        </StyledEndpointControls>
      </RelaySection>
      <AssetHubSection
        ahApi={ahApi}
        ahEvents={ahEvents}
        ahOutput={ahOutput}
        ahUrl={ahUrl || ''}
        isRelayChain={!!isRelayChain}
      >
        <StyledEndpointControls>
          <Dropdown
            defaultValue={ahUrl}
            isButton
            isDisabled={!isRelayChain}
            onChange={_onSelectAhUrl}
            options={ahEndPointOptions.current}
          />
          {showCustomAhInput && isRelayChain && (
            <StyledCustomInput>
              <Input
                autoFocus
                label='Custom AH Endpoint'
                onChange={_onCustomAhUrlChange}
                placeholder='wss://your-asset-hub-endpoint.com'
                value={customAhUrl}
              />
              <Button
                label='Connect'
                onClick={_onApplyCustomAhUrl}
              />
            </StyledCustomInput>
          )}
        </StyledEndpointControls>
      </AssetHubSection>
    </StyledDiv>
  );
}

const StyledEndpointControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledCustomInput = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;

  > div {
    flex: 1;
  }

  button {
    margin-bottom: 0.25rem;
  }
`;

const StyledWarningBanner = styled.div`
  grid-column: 1 / -1;
  padding: 1rem 1.5rem;
  background: var(--bg-table);
  border-radius: 0.5rem;
  border: 2px solid var(--color-warning);

  .ui--MarkWarning {
    margin: 0;
    font-size: var(--font-size-h3);
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const StyledButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-table);
  border-radius: 0.5rem;

  .history-info {
    font-size: var(--font-size-small);
    color: var(--color-text-secondary);

    &.progress {
      color: var(--color-text);
      font-weight: 500;
    }
  }
`;

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  .dropdown {
    min-width: max-content !important;
  }

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
