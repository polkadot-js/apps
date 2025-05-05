// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';
import type { BlockNumber, DispatchInfo, Extrinsic } from '@polkadot/types/interfaces';
import type { ICompact, INumber } from '@polkadot/types/types';

import React, { useMemo } from 'react';

import { AddressMini, LinkExternal, styled } from '@polkadot/react-components';
import { convertWeight } from '@polkadot/react-hooks/useWeight';
import { CallExpander } from '@polkadot/react-params';
import { BN, formatNumber } from '@polkadot/util';

import Event from '../Event.js';
import { useTranslation } from '../translate.js';

interface Props {
  blockNumber?: BlockNumber;
  className?: string;
  events?: KeyedEvent[] | null;
  index: number;
  maxBlockWeight?: BN;
  value: Extrinsic;
  withLink: boolean;
}

const BN_TEN_THOUSAND = new BN(10_000);

function getEra ({ era }: Extrinsic, blockNumber?: BlockNumber): [number, number] | null {
  if (blockNumber && era.isMortalEra) {
    const mortalEra = era.asMortalEra;

    return [mortalEra.birth(blockNumber.toNumber()), mortalEra.death(blockNumber.toNumber())];
  }

  return null;
}

function filterEvents (index: number, events?: KeyedEvent[] | null, maxBlockWeight?: BN): [DispatchInfo | undefined, BN | undefined, number, KeyedEvent[]] {
  const filtered = events
    ? events.filter(({ record: { phase } }) =>
      phase.isApplyExtrinsic &&
      phase.asApplyExtrinsic.eq(index)
    )
    : [];
  const infoRecord = filtered.find(({ record: { event: { method, section } } }) =>
    section === 'system' &&
    ['ExtrinsicFailed', 'ExtrinsicSuccess'].includes(method)
  );
  const dispatchInfo = infoRecord
    ? infoRecord.record.event.method === 'ExtrinsicSuccess'
      ? infoRecord.record.event.data[0] as DispatchInfo
      : infoRecord.record.event.data[1] as DispatchInfo
    : undefined;
  const weight = dispatchInfo && convertWeight(dispatchInfo.weight);

  return [
    dispatchInfo,
    weight?.v1Weight,
    weight && maxBlockWeight
      ? weight.v1Weight.mul(BN_TEN_THOUSAND).div(maxBlockWeight).toNumber() / 100
      : 0,
    filtered
  ];
}

function ExtrinsicDisplay ({ blockNumber, className = '', events, index, maxBlockWeight, value, withLink }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const link = useMemo(
    () => withLink
      ? `#/extrinsics/decode/${value.toHex()}`
      : null,
    [value, withLink]
  );

  const { method, section } = useMemo(
    () => value.registry.findMetaCall(value.callIndex),
    [value]
  );

  const timestamp = useMemo(
    () => section === 'timestamp' && method === 'set'
      ? new Date((value.args[0] as ICompact<INumber>).unwrap().toNumber())
      : undefined,
    [method, section, value]
  );

  const mortality = useMemo(
    (): string | undefined => {
      if (value.isSigned) {
        const era = getEra(value, blockNumber);

        return era
          ? t('mortal, valid from #{{startAt}} to #{{endsAt}}', {
            replace: {
              endsAt: formatNumber(era[1]),
              startAt: formatNumber(era[0])
            }
          })
          : t('immortal');
      }

      return undefined;
    },
    [blockNumber, t, value]
  );

  const [, weight, weightPercentage, thisEvents] = useMemo(
    () => filterEvents(index, events, maxBlockWeight),
    [index, events, maxBlockWeight]
  );

  return (
    <StyledTr
      className={className}
      key={`extrinsic:${index}`}
    >
      <td
        className='top'
        colSpan={2}
      >
        <CallExpander
          className='details'
          mortality={mortality}
          tip={value.tip?.toBn()}
          value={value}
          withHash
          withSignature
        />
        {link && (
          <a
            className='isDecoded'
            href={link}
            rel='noreferrer'
          >{link}</a>
        )}
      </td>
      <td
        className='top media--1000'
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
      <td className='top number media--1400'>
        {weight && (
          <>
            <>{formatNumber(weight)}</>
            <div>{weightPercentage.toFixed(2)}%</div>
          </>
        )}
      </td>
      <td className='top media--1200'>
        {value.isSigned
          ? (
            <>
              <AddressMini value={value.signer} />
              <div className='explorer--BlockByHash-nonce'>
                {t('index')} {formatNumber(value.nonce)}
              </div>
              <LinkExternal
                data={value.hash.toHex()}
                type='extrinsic'
              />
            </>
          )
          : timestamp
            ? timestamp.toLocaleString()
            : null
        }
      </td>
    </StyledTr>
  );
}

const StyledTr = styled.tr`
  .explorer--BlockByHash-event+.explorer--BlockByHash-event {
    margin-top: 0.75rem;
  }

  .explorer--BlockByHash-nonce {
    font-size: var(--font-size-small);
    margin-left: 2.25rem;
    margin-top: -0.5rem;
    opacity: var(--opacity-light);
    text-align: left;
  }

  .explorer--BlockByHash-unsigned {
    opacity: var(--opacity-light);
    font-weight: var(--font-weight-normal);
  }

  a.isDecoded {
    display: block;
    margin-top: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export default React.memo(ExtrinsicDisplay);
