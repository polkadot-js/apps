// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-query/types';
import type { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { AddressMini, Call, Expander, LinkExternal } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import Event from '../Event';
import { useTranslation } from '../translate';

interface Props {
  blockNumber?: BlockNumber;
  className?: string;
  events?: KeyedEvent[];
  index: number;
  value: Extrinsic;
}

function getEra ({ era }: Extrinsic, blockNumber?: BlockNumber): [number, number] | null {
  if (blockNumber && era.isMortalEra) {
    const mortalEra = era.asMortalEra;

    return [mortalEra.birth(blockNumber.toNumber()), mortalEra.death(blockNumber.toNumber())];
  }

  return null;
}

function filterEvents (index: number, events: KeyedEvent[] = []): KeyedEvent[] {
  return events.filter(({ record: { phase } }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index));
}

function ExtrinsicDisplay ({ blockNumber, className = '', events, index, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const { meta, method, section } = useMemo(
    () => value.registry.findMetaCall(value.callIndex),
    [value]
  );

  const mortality = useMemo(
    (): string | undefined => {
      if (value.isSigned) {
        const era = getEra(value, blockNumber);

        return era
          ? t<string>('mortal, valid from #{{startAt}} to #{{endsAt}}', {
            replace: {
              endsAt: formatNumber(era[1]),
              startAt: formatNumber(era[0])
            }
          })
          : t<string>('immortal');
      }

      return undefined;
    },
    [blockNumber, t, value]
  );

  const thisEvents = useMemo(
    () => filterEvents(index, events),
    [index, events]
  );

  return (
    <tr
      className={className}
      key={`extrinsic:${index}`}
    >
      <td
        className='top'
        colSpan={2}
      >
        <Expander
          summary={`${section}.${method}`}
          summaryMeta={meta}
        >
          <Call
            className='details'
            mortality={mortality}
            tip={value.tip?.toBn()}
            value={value}
            withHash
            withSignature
          />
        </Expander>
      </td>
      <td
        className='top'
        colSpan={2}
      >
        {thisEvents.map(({ key, record }) =>
          <Event
            className='explorer--BlockByHash-event'
            key={key}
            value={record}
          />
        )}
      </td>
      <td className='top'>
        {value.isSigned && (
          <>
            <AddressMini value={value.signer} />
            <div className='explorer--BlockByHash-nonce'>
              {t<string>('index')} {formatNumber(value.nonce)}
            </div>
            <LinkExternal
              data={value.hash.toHex()}
              type='extrinsic'
            />
          </>
        )}
      </td>
    </tr>
  );
}

export default React.memo(styled(ExtrinsicDisplay)`
  .explorer--BlockByHash-event+.explorer--BlockByHash-event {
    margin-top: 0.75rem;
  }

  .explorer--BlockByHash-nonce {
    font-size: 0.75rem;
    margin-left: 2.25rem;
    margin-top: -0.5rem;
    opacity: 0.6;
    text-align: left;
  }

  .explorer--BlockByHash-unsigned {
    opacity: 0.6;
    font-weight: var(--font-weight-normal);
  }
`);
