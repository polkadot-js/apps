// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignedBlockExtended } from '@polkadot/api-derive/type';
import type { CandidateReceipt, ParaId } from '@polkadot/types/interfaces';
import type { ScheduledProposals } from '../types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Parachain from './Parachain';

interface Props {
  ids?: ParaId[];
  scheduled?: ScheduledProposals[];
}

function ParachainList ({ ids, scheduled }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  const lastBlock = useCall<SignedBlockExtended>(api.derive.chain.subscribeNewBlocks);
  const [lastIncluded, setLastIncluded] = useState<Record<string, [string, string]>>({});

  const scheduledIds = useMemo(
    () => scheduled
      ? scheduled.reduce((all: Record<string, boolean>, { scheduledIds }: ScheduledProposals): Record<string, boolean> => {
        return scheduledIds.reduce((all: Record<string, boolean>, id) => ({ ...all, [id.toString()]: true }), all);
      }, {})
      : {},
    [scheduled]
  );

  useEffect((): void => {
    lastBlock && setLastIncluded((prev) => {
      const updated: Record<string, [string, string]> = {};
      const blockHash = lastBlock.block.header.hash.toHex();
      let wasUpdated = false;

      lastBlock.events.forEach(({ event, phase }) => {
        if (phase.isApplyExtrinsic && api.events.inclusion.CandidateBacked.is(event)) {
          const { descriptor } = event.data[0] as CandidateReceipt;

          updated[descriptor.paraId.toString()] = [
            blockHash,
            descriptor.relayParent.toHex()
          ];
          wasUpdated = true;
        }
      });

      return wasUpdated
        ? Object.entries(prev).reduce((updated: Record<string, [string, string]>, [id, hashes]): Record<string, [string, string]> => {
          if (!updated[id]) {
            updated[id] = hashes;
          }

          return updated;
        }, updated)
        : prev;
    });
  }, [api, lastBlock]);

  const headerRef = useRef([
    [t('parachains'), 'start', 3],
    [t('heads'), 'start'],
    [t('relay parent'), undefined, 2],
    [t('chain best'), 'media--900'],
    [t('issuance'), 'media--1100'],
    [t('upgrade'), 'media--1300'],
    [t('ump/dmp/hrmp'), 'media--1200']
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
          isScheduled={scheduledIds[id.toString()]}
          key={id.toString()}
          lastInclusion={lastIncluded[id.toString()]}
        />
      ))}
    </Table>
  );
}

export default React.memo(ParachainList);
