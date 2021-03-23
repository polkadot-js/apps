// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetInfo } from './types';

import React from 'react';

import { formatNumber } from '@polkadot/util';

interface Props {
  className?: string;
  value: AssetInfo;
}

function Asset ({ className, value: { id, metadata } }: Props): React.ReactElement<Props> {
  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='together'>{metadata?.name.toUtf8()}</td>
      <td className='upper'>{metadata?.symbol.toUtf8()}</td>
      <td className='all' />
      <td className='button' />
    </tr>
  );
}

export default React.memo(Asset);
