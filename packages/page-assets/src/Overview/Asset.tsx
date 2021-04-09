// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetInfo } from './types';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

interface Props {
  className?: string;
  value: AssetInfo;
}

function Asset ({ className, value: { details, id, metadata } }: Props): React.ReactElement<Props> {
  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='together'>{metadata?.name.toUtf8()}</td>
      <td className='address'>{details && <AddressSmall value={details.owner} />}</td>
      <td className='address'>{details && <AddressSmall value={details.admin} />}</td>
      <td className='address'>{details && <AddressSmall value={details.issuer} />}</td>
      <td className='address'>{details && <AddressSmall value={details.freezer} />}</td>
      <td className='number all'>{formatNumber(metadata?.decimals)}</td>
      <td className='upper'>{metadata?.symbol.toUtf8()}</td>
      <td className='button' />
    </tr>
  );
}

export default React.memo(Asset);
