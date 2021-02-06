// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { FundIndex, FundInfo } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { AddressMini, ParaLink } from '@polkadot/react-components';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  bestNumber?: BN;
  className?: string;
  id: FundIndex;
  info: FundInfo;
}

function Fund ({ bestNumber, className, info: { cap, end, owner, parachain, raised } }: Props): React.ReactElement<Props> {
  const remaining = useMemo(() => bestNumber && end.sub(bestNumber), [bestNumber, end]);

  return (
    <tr className={className}>
      <td className='number'><h1>{parachain}</h1></td>
      <td><ParaLink id={parachain} /></td>
      <td className='address'><AddressMini value={owner} /></td>
      <td className='number'><FormatBalance value={raised} /></td>
      <td className='number'><FormatBalance value={cap} /></td>
      <td className='number'>{remaining && (
        <>
          <BlockToTime blocks={remaining} />
          #{formatNumber(end)}
        </>
      )}</td>
    </tr>
  );
}

export default React.memo(Fund);
