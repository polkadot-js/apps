// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { u64, Vec } from '@polkadot/types';
import { EventRecord, Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { u32 } from '@polkadot/types-codec';

import useErasStartSessionIndexLookup from '../Performance/useErasStartSessionIndexLookup.js';
import { SuspensionEvent } from './index.js';

type SuspensionReasons = [string, string, number][];

function parseEvents (events: EventRecord[]): SuspensionReasons {
  return events.filter(({ event }) => event.section === 'elections' && event.method === 'BanValidators')
    .map(({ event }) => {
      const raw = event.data[0] as unknown as Codec[][];

      const reasons: SuspensionReasons = raw.map((value) => {
        const account = value[0].toString();
        const reasonAndEra = value[1].toHuman() as unknown as Record<string, Codec>;

        const reasonTypeAndValue = reasonAndEra.reason as unknown as Record<string, string>;
        const reasonType = Object.keys(reasonTypeAndValue)[0];
        const reasonValue = Object.values(reasonTypeAndValue)[0];
        const era = Number(reasonAndEra.start.toString());

        if (reasonType === 'OtherReason') {
          return [account, reasonValue, era];
        } else if (reasonType === 'InsufficientUptime') {
          return [account, 'Insufficient uptime in at least ' + reasonValue + ' sessions', era];
        } else {
          return [account, reasonType + ': ' + reasonValue, era];
        }
      });

      return reasons;
    }).flat();
}

interface BanConfig {
  minimalExpectedPerformance: u64,
  underperformedSessionCountThreshold: u32,
  cleanSessionCounterDelay: u32,
  banPeriod: u32,
}

function useSuspensions (): SuspensionEvent[] | undefined {
  const { api } = useApi();
  // below logic is not able to detect kicks in blocks in which elections has failed,
  // as staking.erasStartSessionIndex is not populated (new era does not start)
  const erasStartSessionIndexLookup = useErasStartSessionIndexLookup();
  const [electionBlockHashes, setElectionBlockHashes] = useState<Hash[] | undefined>(undefined);
  const [eventsInBlocks, setEventsInBlocks] = useState<SuspensionReasons | undefined>(undefined);
  const [suspensionEvents, setSuspensionEvents] = useState<SuspensionEvent[] | undefined>(undefined);
  const banConfig = useCall<BanConfig>(api.query.elections.banConfig);
  const currentBanPeriod = useMemo(() => {
    return banConfig?.banPeriod;
  },
  [banConfig]
  );

  const erasElectionsSessionIndexLookup = useMemo((): [number, number][] => {
    return erasStartSessionIndexLookup
      .filter(([, firstSession]) => firstSession > 0)
      .map(([era, firstSession]) => [era, firstSession - 1]);
  },
  [erasStartSessionIndexLookup]
  );

  useEffect(() => {
    if (!(api && api.consts.elections) || erasStartSessionIndexLookup.length === 0) {
      return;
    }

    const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
    const promises = erasElectionsSessionIndexLookup.map(([, electionSessionIndex]) => {
      return api.rpc.chain.getBlockHash(electionSessionIndex * sessionPeriod);
    });

    Promise.all(promises)
      .then((blockHashes) => setElectionBlockHashes(blockHashes))
      .catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(erasElectionsSessionIndexLookup)]
  );

  useEffect(() => {
    if (electionBlockHashes === undefined) {
      return;
    }

    const promisesApiAtFirstBlock = electionBlockHashes.map((hash) => api.at(hash.toString()));

    Promise.all(promisesApiAtFirstBlock).then((apis) => {
      const promisesSystemEvents = apis.map((promise) => promise.query.system.events());

      Promise.all(promisesSystemEvents)
        .then((events: Vec<EventRecord>[]) => {
          const parsedEvents = parseEvents(events.map((vecOfEvents) => vecOfEvents.toArray()).flat());

          setEventsInBlocks(parsedEvents);
        }).catch(console.error);
    }).catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(electionBlockHashes)]
  );

  useEffect(() => {
    if (!currentBanPeriod) {
      return;
    }

    const events = eventsInBlocks?.map(([address, suspensionReason, era]) => {
      return {
        address,
        era,
        suspensionLiftsInEra: era + currentBanPeriod.toNumber(),
        suspensionReason
      };
    }).reverse();

    setSuspensionEvents(events);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(eventsInBlocks), currentBanPeriod]
  );

  return suspensionEvents;
}

export default createNamedHook('useSuspensions', useSuspensions);
