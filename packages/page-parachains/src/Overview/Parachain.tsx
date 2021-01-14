// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/settings/types';
import type { Option } from '@polkadot/types';
import type { Balance, BlockNumber, Hash, HeadData, Header, ParaId } from '@polkadot/types/interfaces';

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
  lastRelayParent?: Hash;
}

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

function getChainLink (endpoints: LinkOption[]): React.ReactNode {
  if (!endpoints.length) {
    return null;
  }

  const { text, value } = endpoints[endpoints.length - 1];

  return <a href={`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(value)}`}>{text}</a>;
}

function Parachain ({ bestNumber, className = '', id, lastRelayParent }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { api: paraApi, endpoints } = useParaApi(id);
  const headHex = useCall<string | null>(api.query.paras.heads, [id], transformHead);
  // const watermark = useCall<BlockNumber | null>(api.query.hrmp?.hrmpWatermarks, [id], transformMark);
  const paraBest = useCall<BlockNumber>(paraApi?.derive.chain.bestNumber);
  const paraIssu = useCall<Balance>(paraApi?.query.balances?.totalIssuance);
  const lastRelayNumber = useCall<BN>(lastRelayParent && api.rpc.chain.getHeader, [lastRelayParent], transformLast);

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
      <td className='number'>{lastRelayNumber && formatNumber(lastRelayNumber)}</td>
      <td className='number'>{paraBest && formatNumber(paraBest)}</td>
      <td className='number'>{paraIssu && <FormatBalance valueFormatted={paraIssu.toHuman()} />}</td>
    </tr>
  );
}

export default React.memo(Parachain);
