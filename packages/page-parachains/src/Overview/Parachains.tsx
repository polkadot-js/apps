// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SignedBlockExtended } from '@polkadot/api-derive/types';
import type { AccountId, CandidateReceipt, Event, ParaId, ParaValidatorIndex } from '@polkadot/types/interfaces';
import type { IEvent } from '@polkadot/types/types';
import type { LeasePeriod, QueuedAction, ScheduledProposals } from '../types';
import type { EventMapInfo, ValidatorInfo } from './types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall, useCallMulti, useIsParasLinked } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import useHrmp from '../useHrmp';
import Parachain from './Parachain';

interface Props {
  actionsQueue: QueuedAction[];
  ids?: ParaId[];
  leasePeriod?: LeasePeriod;
  scheduled?: ScheduledProposals[];
}

type EventMap = Record<string, EventMapInfo>;

interface LastEvents {
  lastBacked: EventMap;
  lastIncluded: EventMap;
  lastTimeout: EventMap;
}

type MultiResult = [AccountId[] | null, ParaValidatorIndex[][] | null, ParaValidatorIndex[] | null];

const EMPTY_EVENTS: LastEvents = { lastBacked: {}, lastIncluded: {}, lastTimeout: {} };

const optionsMulti = {
  defaultValue: [null, null, null] as MultiResult
};

function includeEntry (map: EventMap, event: Event, blockHash: string, blockNumber: BN): void {
  const { descriptor } = (event as unknown as IEvent<[CandidateReceipt]>).data[0];

  if (descriptor) {
    map[descriptor.paraId.toString()] = {
      blockHash,
      blockNumber,
      relayParent: descriptor.relayParent.toHex()
    };
  }
}

function extractScheduledIds (scheduled: ScheduledProposals[] = []): Record<string, boolean> {
  return scheduled.reduce((all: Record<string, boolean>, { scheduledIds }: ScheduledProposals): Record<string, boolean> =>
    scheduledIds.reduce((all: Record<string, boolean>, id) => ({
      ...all,
      [id.toString()]: true
    }), all), {});
}

function mapValidators (ids: ParaId[] | undefined, validators: AccountId[] | null, validatorGroups: ParaValidatorIndex[][] | null, activeIndices: ParaValidatorIndex[] | null): Record<string, ValidatorInfo[]> {
  console.log(ids && ids.length, validatorGroups && validatorGroups.length);

  return activeIndices && validators && validatorGroups && ids && ids.length <= validatorGroups.length
    ? ids.reduce((all: Record<string, ValidatorInfo[]>, id, index) => ({
      ...all,
      [id.toString()]: validatorGroups[index]
        .map((indexActive) => [indexActive, activeIndices[indexActive.toNumber()]])
        .filter(([, a]) => a)
        .map(([indexActive, indexValidator]) => ({
          indexActive,
          indexValidator,
          validatorId: validators[indexValidator.toNumber()]
        }))
    }), {})
    : {};
}

function extractEvents (api: ApiPromise, lastBlock: SignedBlockExtended, prev: LastEvents): LastEvents {
  const backed: EventMap = {};
  const included: EventMap = {};
  const timeout: EventMap = {};
  const blockNumber = lastBlock.block.header.number.unwrap();
  const blockHash = lastBlock.block.header.hash.toHex();
  let wasBacked = false;
  let wasIncluded = false;
  let wasTimeout = false;

  lastBlock.events.forEach(({ event, phase }) => {
    if (phase.isApplyExtrinsic) {
      if (api.events.inclusion.CandidateBacked.is(event)) {
        includeEntry(backed, event, blockHash, blockNumber);
        wasBacked = true;
      } else if (api.events.inclusion.CandidateIncluded.is(event)) {
        includeEntry(included, event, blockHash, blockNumber);
        wasIncluded = true;
      } else if (api.events.inclusion.CandidateTimedOut.is(event)) {
        includeEntry(timeout, event, blockHash, blockNumber);
        wasTimeout = true;
      }
    }
  });

  return wasBacked || wasIncluded || wasTimeout
    ? {
      lastBacked: wasBacked
        ? { ...prev.lastBacked, ...backed }
        : prev.lastBacked,
      lastIncluded: wasIncluded
        ? { ...prev.lastIncluded, ...included }
        : prev.lastIncluded,
      lastTimeout: wasTimeout
        ? { ...prev.lastTimeout, ...timeout }
        : prev.lastTimeout
    }
    : prev;
}

function extractActions (actionsQueue: QueuedAction[], knownIds?: [ParaId, string][]): Record<string, QueuedAction | undefined> {
  return actionsQueue && knownIds
    ? knownIds.reduce((all: Record<string, QueuedAction | undefined>, [id, key]) => ({
      ...all,
      [key]: actionsQueue.find(({ paraIds }) => paraIds.some((p) => p.eq(id)))
    }), {})
    : {};
}

function extractIds (hasLinksMap: Record<string, boolean>, ids?: ParaId[]): [ParaId, string][] | undefined {
  return ids
    ?.map((id): [ParaId, string] => [id, id.toString()])
    .sort(([aId, aIds], [bId, bIds]): number => {
      const aKnown = hasLinksMap[aIds] || false;
      const bKnown = hasLinksMap[bIds] || false;

      return aKnown === bKnown
        ? aId.cmp(bId)
        : aKnown
          ? -1
          : 1;
    });
}

function Parachains ({ actionsQueue, ids, leasePeriod, scheduled }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useBestNumber();
  const lastBlock = useCall<SignedBlockExtended>(api.derive.chain.subscribeNewBlocks);
  const [{ lastBacked, lastIncluded, lastTimeout }, setLastEvents] = useState<LastEvents>(EMPTY_EVENTS);
  const [validators, validatorGroups, activeIndices] = useCallMulti<MultiResult>([
    api.query.session?.validators,
    api.query.paraScheduler?.validatorGroups || api.query.scheduler?.validatorGroups,
    api.query.shared?.activeValidatorIndices
  ], optionsMulti);
  const hrmp = useHrmp();
  const hasLinksMap = useIsParasLinked(ids);

  const headerRef = useRef([
    [t('parachains'), 'start', 2],
    ['', 'media--1400'],
    [t('head'), 'start media--1500'],
    [t('lifecycle'), 'start'],
    [],
    [t('included'), undefined, 2],
    [t('backed'), 'no-pad-left media--800'],
    [t('timeout'), 'no-pad-left media--900'],
    [t('chain'), 'no-pad-left'],
    [t('in/out (msg)'), 'media--1200', 2],
    [t('leases'), 'media--1000']
  ]);

  const scheduledIds = useMemo(
    () => extractScheduledIds(scheduled),
    [scheduled]
  );

  const validatorMap = useMemo(
    () => mapValidators(ids, validators, validatorGroups, activeIndices),
    [activeIndices, ids, validators, validatorGroups]
  );

  const knownIds = useMemo(
    () => extractIds(hasLinksMap, ids),
    [ids, hasLinksMap]
  );

  const nextActions = useMemo(
    () => extractActions(actionsQueue, knownIds),
    [actionsQueue, knownIds]
  );

  useEffect((): void => {
    lastBlock && setLastEvents((prev) =>
      extractEvents(api, lastBlock, prev)
    );
  }, [api, lastBlock]);

  return (
    <Table
      empty={knownIds && t<string>('There are no registered parachains')}
      header={headerRef.current}
    >
      {knownIds?.map(([id, key]): React.ReactNode => (
        <Parachain
          bestNumber={bestNumber}
          channelDst={hrmp?.dst[id.toString()]}
          channelSrc={hrmp?.src[id.toString()]}
          id={id}
          isScheduled={scheduledIds[key]}
          key={key}
          lastBacked={lastBacked[key]}
          lastInclusion={lastIncluded[key]}
          lastTimeout={lastTimeout[key]}
          leasePeriod={leasePeriod}
          nextAction={nextActions[key]}
          sessionValidators={validators}
          validators={validatorMap[key]}
        />
      ))}
    </Table>
  );
}

export default React.memo(Parachains);
