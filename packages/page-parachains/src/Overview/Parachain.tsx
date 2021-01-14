// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/settings/types';
import type { Option } from '@polkadot/types';
import type { Balance, BlockNumber, HeadData, Header, ParaId, RelayChainBlockNumber } from '@polkadot/types/interfaces';
import type { Codec, ITuple } from '@polkadot/types/types';

import BN from 'bn.js';
import React, { useMemo } from 'react';

import { useApi, useCall, useParaApi } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { sliceHex } from './util';

interface Props {
  bestNumber?: BN;
  className?: string;
  id: ParaId;
  lastInclusion?: [string, string];
}

const transformDmpUmp = {
  transform: (list: Codec[][]) => list.length
};

const transformHead = {
  transform: (headData: Option<HeadData>): string | null =>
    headData.isSome
      ? sliceHex(headData.unwrap(), 18)
      : null
};

// const transformMark = {
//   transform: (watermark: Option<BlockNumber>): BlockNumber | null =>
//     watermark.isSome
//       ? watermark.unwrap()
//       : null
// };

const transformLast = {
  transform: (header: Header) => header.number.unwrap()
};

const transformUpgrade = {
  transform: (opt: Option<ITuple<[RelayChainBlockNumber]>>): RelayChainBlockNumber | null =>
    opt.unwrapOr([null])[0]
};

function getChainLink (endpoints: LinkOption[]): React.ReactNode {
  if (!endpoints.length) {
    return null;
  }

  const { text, value } = endpoints[endpoints.length - 1];

  return <a href={`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(value)}`}>{text}</a>;
}

function Parachain ({ bestNumber, className = '', id, lastInclusion }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { api: paraApi, endpoints } = useParaApi(id);
  const paraBest = useCall<BlockNumber>(paraApi?.derive.chain.bestNumber);
  const paraIssu = useCall<Balance>(paraApi?.query.balances?.totalIssuance);
  const headHex = useCall<string | null>(api.query.paras.heads, [id], transformHead);
  const updateAt = useCall<BlockNumber | null>(api.query.paras.futureCodeUpgrades, [id], transformUpgrade);
  const qDmp = useCall<number>(api.query.dmp.downwardMessageQueues, [id], transformDmpUmp);
  const qUmp = useCall<number>(api.query.dmp.relayDispatchQueues, [id], transformDmpUmp);
  const qHrmpE = useCall<number>(api.query.hrmp.hrmpEgressChannelsIndex, [id], transformDmpUmp);
  const qHrmpI = useCall<number>(api.query.hrmp.hrmpIngressChannelsIndex, [id], transformDmpUmp);
  const lastRelayNumber = useCall<BN>(lastInclusion && api.rpc.chain.getHeader, [lastInclusion && lastInclusion[1]], transformLast);

  const blockDelay = useMemo(
    () => lastRelayNumber && bestNumber && bestNumber.sub(lastRelayNumber).subn(1),
    [bestNumber, lastRelayNumber]
  );

  const chainLink = useMemo(
    () => getChainLink(endpoints),
    [endpoints]
  );

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='together'>{chainLink}</td>
      <td className='all start together hash'>{headHex}</td>
      <td className='number'>{blockDelay && <BlockToTime blocks={blockDelay} />}</td>
      <td className='number'>
        {lastInclusion && lastRelayNumber && (
          <a href={`#/explorer/query/${lastInclusion[0]}`}>{formatNumber(lastRelayNumber)}</a>
        )
        }
      </td>
      <td className='number media--900'>{paraBest && <>{formatNumber(paraBest)}</>}</td>
      <td className='number media--1100'>{paraIssu && <FormatBalance valueFormatted={paraIssu.toHuman()} />}</td>
      <td className='number media--1300'>
        {updateAt && bestNumber && (
          <>
            <BlockToTime blocks={bestNumber.sub(updateAt)} />
            #{formatNumber(updateAt)}
          </>
        )}
      </td>
      <td className='number media--1200'>
        {formatNumber(qUmp)}&nbsp;/&nbsp;{formatNumber(qDmp)}&nbsp;/&nbsp;{formatNumber(qHrmpE)}&nbsp;/&nbsp;{formatNumber(qHrmpI)}
      </td>
    </tr>
  );
}

export default React.memo(Parachain);
