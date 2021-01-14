// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CandidateReceipt, EventRecord, Hash, ParaId } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Parachain from './Parachain';

interface Props {
  ids?: ParaId[];
}

function ParachainList ({ ids }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  const eventRecords = useCall<EventRecord[]>(api.query.system.events);
  const [lastIncluded, setLastIncluded] = useState<Record<string, Hash>>({});

  useEffect((): void => {
    eventRecords && setLastIncluded((prev) => {
      const updated: Record<string, Hash> = {};
      let wasUpdated = false;

      eventRecords.forEach(({ event, phase }) => {
        if (phase.isApplyExtrinsic && api.events.inclusion?.CandidateBacked.is(event)) {
          const { descriptor } = event.data[0] as CandidateReceipt;

          updated[descriptor.paraId.toString()] = descriptor.relayParent;
          wasUpdated = true;
        }
      });

      return wasUpdated
        ? Object.entries(prev).reduce((updated: Record<string, Hash>, [id, hash]): Record<string, Hash> => {
          if (!updated[id]) {
            updated[id] = hash;
          }

          return updated;
        }, updated)
        : prev;
    });
  }, [api, eventRecords]);

  const headerRef = useRef([
    [t('parachains'), 'start', 2],
    [t('heads'), 'start'],
    [t('relay parent'), 'undefined', 2],
    [t('chain best')],
    [t('issuance')]
  ]);

  return (
    <Table
      empty={ids && t<string>('There are no registered parachains')}
      header={headerRef.current}
    >
      {ids?.map((id): React.ReactNode => (
        <Parachain
          bestNumber={bestNumber}
          id={id}
          key={id.toString()}
          lastRelayParent={lastIncluded[id.toString()]}
        />
      ))}
    </Table>
  );
}

export default React.memo(ParachainList);
