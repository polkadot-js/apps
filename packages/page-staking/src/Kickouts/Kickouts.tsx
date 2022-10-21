// [object Object]
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';

import { ApiPromise } from '@polkadot/api';
import { KickOutEvent } from '@polkadot/app-staking/Kickouts/index';
import useErasStartSessionIndexLookup from '@polkadot/app-staking/Performance/useErasStartSessionIndexLookup';
import { createNamedHook, useApi } from '@polkadot/react-hooks';
import { Vec } from '@polkadot/types';
import { EventRecord, Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

function parseEvents (eventsInBlocks: Vec<EventRecord>[], api: ApiPromise): [string, string][][][] {
  return eventsInBlocks.map((events) => {
    return events.filter(({ event }) => {
      return event.section == 'elections' && event.method == 'KickOutValidators';
    })
      .map(({ event }) => {
        const data = event.data[0];
        const raw: Codec[][] = api.createType(data.toRawType(), data);

        return raw.map((value) => {
          const account = value[0].toString();
          const reasonTypeAndValue = value[1].toHuman();
          const reasonType = Object.keys(reasonTypeAndValue as Object)[0];
          const reasonValue = Object.values(reasonTypeAndValue as Object)[0] as string;

          if (reasonType == 'OtherReason') {
            return [account, reasonValue];
          } else if (reasonType == 'InsufficientUptime') {
            return [account, 'Insufficient uptime in at least ' + reasonValue + ' sessions'];
          } else {
            return [account, reasonType + ': ' + reasonValue];
          }
        });
      });
  });
}

function useKickOuts (): KickOutEvent[] {
  const { api } = useApi();
  // below logic is not able to detect kicks in blocks in which elections has failed,
  // as staking.erasStartSessionIndex is not populated (new era does not start)
  const erasStartSessionIndexLookup = useErasStartSessionIndexLookup();
  const [electionBlockHashes, setElectionBlockHashes] = useState<Hash[]>([]);
  const [eventsInBlocks, setEventsInBlocks] = useState<[string, string][][][]>([]);

  const [kickOutEvents, setKickOutEvents] = useState<KickOutEvent[]>([]);

  const erasElectionsSessionIndexLookup = useMemo((): [number, number][] => {
    return erasStartSessionIndexLookup
      .filter(([era, firstSession]) => firstSession > 0)
      .map(([era, firstSession]) => [era, firstSession - 1]);
  },
  [erasStartSessionIndexLookup]
  );

  useEffect(() => {
    if (api && api.consts.elections) {
      const sessionPeriod = Number(api.consts.elections.sessionPeriod.toString());
      const promises = erasElectionsSessionIndexLookup.map(([, electionSessionIndex]) => {
        console.log('Query api at block nr ', electionSessionIndex * sessionPeriod);

        return api.rpc.chain.getBlockHash(electionSessionIndex * sessionPeriod);
      });

      Promise.all(promises)
        .then((blockHashes) => setElectionBlockHashes(blockHashes))
        .catch(console.error);
    }
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
          console.log('all events: ', events);
          const parsedEvents = parseEvents(events, api);

          console.log('parsedEvents', parsedEvents);
          setEventsInBlocks(parsedEvents);
        }).catch(console.error);
    }).catch(console.error);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [api, JSON.stringify(electionBlockHashes)]
  );

  useEffect(() => {
    if (eventsInBlocks.length > 0 && erasElectionsSessionIndexLookup) {
      const eventsWithEra: [number, [string, string][][]][] = erasStartSessionIndexLookup.map(function ([era], i) {
        return [era, eventsInBlocks[i]];
      });
        // console.log(eventsWithEra);
      const events = eventsWithEra.filter(([, kickOutReasonsInEras]) => kickOutReasonsInEras && kickOutReasonsInEras.length > 0)
        .map(([era, kickOutReasonsInEras]) => {
          if (kickOutReasonsInEras.length == 1) {
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
    }
  },
  [api, JSON.stringify(eventsInBlocks), JSON.stringify(erasStartSessionIndexLookup)]
  );

  return kickOutEvents;
}

export default createNamedHook('useKickouts', useKickOuts);
