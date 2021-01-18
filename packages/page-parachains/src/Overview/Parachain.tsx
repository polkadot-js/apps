// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, Vec } from '@polkadot/types';
import type { Balance, BlockNumber, HeadData, Header, ParaId } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';

import BN from 'bn.js';
import React, { useMemo } from 'react';

import { Badge } from '@polkadot/react-components';
import { useApi, useCall, useCallMulti, useParaApi } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { getChainLink, sliceHex } from '../util';

interface Props {
  bestNumber?: BN;
  className?: string;
  id: ParaId;
  isScheduled?: boolean;
  lastInclusion?: [string, string];
}

type QueryResult = [Option<HeadData>, Option<BlockNumber>, Vec<Codec>, Vec<Codec>, Vec<Codec>, Vec<Codec>, Option<BlockNumber>];

interface QueryState {
  headHex: string | null;
  updateAt: BlockNumber | null;
  qDmp: number;
  qUmp: number;
  qHrmpE: number;
  qHrmpI: number;
  watermark: BlockNumber | null;
}

const transformLast = {
  transform: (header: Header) => header.number.unwrap()
};

const optionsMulti = {
  defaultValue: {
    headHex: null,
    qDmp: 0,
    qHrmpE: 0,
    qHrmpI: 0,
    qUmp: 0,
    updateAt: null,
    watermark: null
  },
  transform: ([headData, optUp, dmp, ump, hrmpE, hrmpI, optWm]: QueryResult): QueryState => ({
    headHex: headData.isSome
      ? sliceHex(headData.unwrap(), 18)
      : null,
    qDmp: dmp.length,
    qHrmpE: hrmpE.length,
    qHrmpI: hrmpI.length,
    qUmp: ump.length,
    updateAt: optUp.unwrapOr(null),
    watermark: optWm.unwrapOr(null)
  })
};

function Parachain ({ bestNumber, className = '', id, isScheduled, lastInclusion }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { api: paraApi, endpoints } = useParaApi(id);
  const paraBest = useCall<BlockNumber>(paraApi?.derive.chain.bestNumber);
  const paraIssu = useCall<Balance>(paraApi?.query.balances?.totalIssuance);
  const lastRelayNumber = useCall<BN>(lastInclusion && api.rpc.chain.getHeader, [lastInclusion && lastInclusion[1]], transformLast);
  const paraInfo = useCallMulti<QueryState>([
    [api.query.paras.heads, id],
    [api.query.paras.futureCodeUpgrades, id],
    [api.query.dmp.downwardMessageQueues, id],
    [api.query.ump.relayDispatchQueues, id],
    [api.query.hrmp.hrmpEgressChannelsIndex, id],
    [api.query.hrmp.hrmpIngressChannelsIndex, id],
    [api.query.hrmp.hrmpWatermarks, id]
  ], optionsMulti);

  const blockDelay = useMemo(
    () => bestNumber && (
      lastRelayNumber
        ? bestNumber.sub(lastRelayNumber).subn(1)
        : paraInfo.watermark
          ? bestNumber.sub(paraInfo.watermark)
          : undefined
    ),
    [bestNumber, lastRelayNumber, paraInfo]
  );

  const chainLink = useMemo(
    () => getChainLink(endpoints),
    [endpoints]
  );

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='badge'>{isScheduled && (
        <Badge
          color='green'
          icon='clock'
        />
      )}</td>
      <td className='badge together'>{chainLink}</td>
      <td className='all start together hash'>{paraInfo.headHex}</td>
      <td className='number'>{blockDelay && <BlockToTime blocks={blockDelay} />}</td>
      <td className='number'>
        {lastInclusion && lastRelayNumber
          ? <a href={`#/explorer/query/${lastInclusion[0]}`}>{formatNumber(lastRelayNumber)}</a>
          : paraInfo.watermark && formatNumber(paraInfo.watermark)
        }
      </td>
      <td className='number media--900'>{paraBest && <>{formatNumber(paraBest)}</>}</td>
      <td className='number media--1100'>{paraIssu && <FormatBalance valueFormatted={paraIssu.toHuman()} />}</td>
      <td className='number media--1300'>
        {paraInfo.updateAt && bestNumber && (
          <>
            <BlockToTime blocks={bestNumber.sub(paraInfo.updateAt)} />
            #{formatNumber(paraInfo.updateAt)}
          </>
        )}
      </td>
      <td className='number media--1200'>
        {formatNumber(paraInfo.qUmp)}&nbsp;/&nbsp;{formatNumber(paraInfo.qDmp)}&nbsp;/&nbsp;{formatNumber(paraInfo.qHrmpE)}&nbsp;/&nbsp;{formatNumber(paraInfo.qHrmpI)}
      </td>
    </tr>
  );
}

export default React.memo(Parachain);
