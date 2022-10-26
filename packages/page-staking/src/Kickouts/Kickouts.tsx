// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';

import { KickOutEvent } from '@polkadot/app-staking/Kickouts/index';
import useErasStartSessionIndexLookup from '@polkadot/app-staking/Performance/useErasStartSessionIndexLookup';
import { createNamedHook, useApi } from '@polkadot/react-hooks';
import { Vec } from '@polkadot/types';
import { EventRecord, Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

type KickOutReasons = [string, string][];
type KickOutEventsInBlock = KickOutReasons[];
type KickOutEventsInEras = KickOutEventsInBlock[];

function parseEvents (eventsInBlocks: Vec<EventRecord>[]): KickOutEventsInEras {
  return eventsInBlocks.map((events) => {
    return events.filter(({ event }) => {
      return event.section === 'elections' && event.method === 'KickOutValidators';
    })
      .map(({ event }) => {
        const raw = event.data[0] as unknown as Codec[][];

        return raw.map((value) => {
          const account = value[0].toString();
          const reasonTypeAndValue = value[1].toHuman() as Record<string, string>;
          const reasonType = Object.keys(reasonTypeAndValue)[0];
          const reasonValue = Object.values(reasonTypeAndValue)[0];

          if (reasonType === 'OtherReason') {
            return [account, reasonValue];
          } else if (reasonType === 'InsufficientUptime') {
            return [account, 'Insufficient uptime in at least ' + reasonValue + ' sessions'];
          } else {
            return [account, reasonType + ': ' + reasonValue];
          }
        });
      });
  });
}

function useKickOuts (): KickOutEvent[] | undefined {
  const { api } = useApi();
  // below logic is not able to detect kicks in blocks in which elections has failed,
  // as staking.erasStartSessionIndex is not populated (new era does not start)
  const erasStartSessionIndexLookup = useErasStartSessionIndexLookup();
  const [electionBlockHashes, setElectionBlockHashes] = useState<Hash[]>([]);
  const [eventsInBlocks, setEventsInBlocks] = useState<KickOutEventsInEras>([]);
  const [kickOutEvents, setKickOutEvents] = useState<KickOutEvent[] | undefined>(undefined);

  const erasElectionsSessionIndexLookup = useMemo((): [number, number][] => {
    return erasStartSessionIndexLookup
      .filter(([, firstSession]) => firstSession > 0)
      .map(([era, firstSession]) => [era, firstSession - 1]);
  },
  [erasStartSessionIndexLookup]
  );

  useEffect(() => {
    if (!(api && api.consts.elections)) {
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
    const promisesApiAtFirstBlock = electionBlockHashes.map((hash) => api.at(hash.toString()));

    Promise.all(promisesApiAtFirstBlock).then((apis) => {
      const promisesSystemEvents = apis.map((promise) => promise.query.system.events());

      Promise.all(promisesSystemEvents)
        .then((events: Vec<EventRecord>[]) => {
          const parsedEvents = parseEvents(events);

          setEventsInBlocks(parsedEvents);
        }).catch(console.error);
    }).catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(electionBlockHashes)]
  );

  useEffect(() => {
    if (eventsInBlocks.length === 0 || !erasElectionsSessionIndexLookup) {
      return;
    }

    const eventsWithEra: [number, KickOutEventsInBlock][] = erasStartSessionIndexLookup.map(function ([era], i) {
      return [era, eventsInBlocks[i]];
    });
    const events = eventsWithEra.filter(([, kickOutReasonsInEras]) => kickOutReasonsInEras && kickOutReasonsInEras.length > 0)
      .map(([era, kickOutReasonsInEras]) => {
        if (kickOutReasonsInEras.length === 1) {
          return kickOutReasonsInEras[0].map(([address, kickoutReason]) => {
            return {
              address,
              era,
              kickoutReason
            };
          });
        }

        return [];
      }).flat().reverse();

    setKickOutEvents(events);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(eventsInBlocks), JSON.stringify(erasStartSessionIndexLookup), JSON.stringify(erasElectionsSessionIndexLookup)]
  );

  return kickOutEvents;
}

export default createNamedHook('useKickouts', useKickOuts);
