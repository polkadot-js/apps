// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignedBlockExtended } from '@polkadot/api-derive/type';
import type { AccountId, CandidateReceipt, Event, ParaId, ParaValidatorIndex } from '@polkadot/types/interfaces';
import type { ScheduledProposals } from '../types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall, useCallMulti } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Parachain from './Parachain';

interface Props {
  ids?: ParaId[];
  scheduled?: ScheduledProposals[];
}

type EventMap = Record<string, [string, string, BN]>;

interface LastEvents {
  lastBacked: EventMap;
  lastIncluded: EventMap;
}

const optionsMulti = {
  defaultValue: [null, null] as [AccountId[] | null, ParaValidatorIndex[][] | null]
};

function includeEntry (map: EventMap, event: Event, blockHash: string, blockNumber: BN): void {
  const { descriptor } = event.data[0] as CandidateReceipt;

  if (descriptor) {
    map[descriptor.paraId.toString()] = [
      blockHash,
      descriptor.relayParent.toHex(),
      blockNumber
    ];
  }
}

function ParachainList ({ ids, scheduled }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  const lastBlock = useCall<SignedBlockExtended>(api.derive.chain.subscribeNewBlocks);
  const [{ lastBacked, lastIncluded }, setLastEvents] = useState<LastEvents>({ lastBacked: {}, lastIncluded: {} });
  const [validators, validatorGroups] = useCallMulti<[AccountId[] | null, ParaValidatorIndex[][] | null]>([
    api.query.session?.validators,
    api.query.paraScheduler?.validatorGroups || api.query.scheduler?.validatorGroups
  ], optionsMulti);

  const scheduledIds = useMemo(
    () => (scheduled || []).reduce((all: Record<string, boolean>, { scheduledIds }: ScheduledProposals): Record<string, boolean> => {
      return scheduledIds.reduce((all: Record<string, boolean>, id) => ({ ...all, [id.toString()]: true }), all);
    }, {}),
    [scheduled]
  );

  const validatorMap = useMemo(
    () => validators && validatorGroups && ids && ids.length === validatorGroups.length
      ? validatorGroups.map((ids) =>
        ids
          .map((id) => validators[id.toNumber()])
          .filter((a) => a)
      )
      : [],
    [ids, validators, validatorGroups]
  );

  useEffect((): void => {
    lastBlock && setLastEvents((prev) => {
      const backed: Record<string, [string, string, BN]> = {};
      const included: Record<string, [string, string, BN]> = {};
      const blockNumber = lastBlock.block.header.number.unwrap();
      const blockHash = lastBlock.block.header.hash.toHex();
      let wasIncluded = false;
      let wasBacked = false;

      lastBlock.events.forEach(({ event, phase }) => {
        if (phase.isApplyExtrinsic) {
          if (api.events.inclusion.CandidateBacked.is(event)) {
            includeEntry(backed, event, blockHash, blockNumber);
            wasBacked = true;
          } else if (api.events.inclusion.CandidateIncluded.is(event)) {
            includeEntry(included, event, blockHash, blockNumber);
            wasIncluded = true;
          }
        }
      });

      return wasBacked || wasIncluded
        ? {
          lastBacked: wasBacked
            ? { ...prev.lastBacked, ...backed }
            : prev.lastBacked,
          lastIncluded: wasIncluded
            ? { ...prev.lastIncluded, ...included }
            : prev.lastIncluded
        }
        : prev;
    });
  }, [api, lastBlock]);

  const headerRef = useRef([
    [t('parachains'), 'start', 3],
    ['', 'media--1500'],
    [t('heads'), 'start'],
    [t('included'), undefined, 2],
    [t('backed')],
    [t('chain best'), 'media--900'],
    [t('upgrade'), 'media--1300'],
    [t('ump/dmp/hrmp'), 'media--1200']
  ]);

  return (
    <Table
      empty={ids && t<string>('There are no registered parachains')}
      header={headerRef.current}
    >
      {ids?.map((id, index): React.ReactNode => (
        <Parachain
          bestNumber={bestNumber}
          id={id}
          isScheduled={scheduledIds[id.toString()]}
          key={id.toString()}
          lastBacked={lastBacked[id.toString()]}
          lastInclusion={lastIncluded[id.toString()]}
          validators={validatorMap[index]}
        />
      ))}
    </Table>
  );
}

export default React.memo(ParachainList);
