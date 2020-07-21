// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';
import { KeyedEvent } from '@polkadot/react-query/types';

import React from 'react';
import styled from 'styled-components';
import { registry } from '@polkadot/react-api';
import { AddressMini, Call, Expander, LinkExternal } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Event from '../Event';

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
  const { meta, method, section } = registry.findMetaCall(value.callIndex);
  const era = getEra(value, blockNumber);
  const thisEvents = filterEvents(index, events);

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
            mortality={
              era
                ? t<string>('mortal, valid from #{{startAt}} to #{{endsAt}}', {
                  replace: {
                    endsAt: formatNumber(era[1]),
                    startAt: formatNumber(era[0])
                  }
                })
                : t<string>('immortal')
            }
            tip={value.tip?.toBn()}
            value={value}
            withHash
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
        {value.isSigned
          ? (
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
          )
          : <div className='explorer--BlockByHash-unsigned'>{t<string>('not signed')}</div>
        }
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
    font-weight: 100;
  }
`);
