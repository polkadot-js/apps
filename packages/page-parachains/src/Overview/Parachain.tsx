// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BlockNumber, HeadData, ParaId } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { sliceHex } from './util';

interface Props {
  bestNumber?: BN;
  className?: string;
  id: ParaId;
}

const transformHead = {
  transform: (headData: Option<HeadData>): string | null =>
    headData.isSome
      ? sliceHex(headData.unwrap(), 18)
      : null
};

const transformMark = {
  transform: (watermark: Option<BlockNumber>): BlockNumber | null =>
    watermark.isSome
      ? watermark.unwrap()
      : null
};

function Parachain ({ bestNumber, className = '', id }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const headHex = useCall<string | null>(api.query.paras.heads, [id], transformHead);
  const watermark = useCall<BlockNumber | null>(api.query.hrmp?.hrmpWatermarks, [id], transformMark);

  const blockDelay = useMemo(
    () => watermark && bestNumber && bestNumber.sub(watermark),
    [bestNumber, watermark]
  );

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td />
      <td className='all start together hash'>{headHex}</td>
      <td className='number'>{formatNumber(watermark)}</td>
      <td className='number'>{blockDelay && <BlockToTime blocks={blockDelay} />}</td>
    </tr>
  );
}

export default React.memo(Parachain);
