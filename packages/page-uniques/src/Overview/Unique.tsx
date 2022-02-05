// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UniqueInfo } from '../types';

import React, { useMemo } from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Mint from './Mint';

interface Props {
  className?: string;
  value: UniqueInfo;
}

function Unique ({ className, value: { details, id, isIssuerMe, metadata } }: Props): React.ReactElement<Props> {
  const format = useMemo(
    () => [0, '---'],
    [metadata]
  );

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='address media--700'>{details && <AddressSmall value={details.owner} />}</td>
      <td className='address media--1000'>{details && <AddressSmall value={details.admin} />}</td>
      <td className='address media--1300'>{details && <AddressSmall value={details.issuer} />}</td>
      <td className='address media--1600'>{details && <AddressSmall value={details.freezer} />}</td>
      <td className='number all'>{details && (formatNumber(details.instances))}</td>
      <td className='button'>{details && metadata && isIssuerMe && (
        <Mint
          details={details}
          id={id}
          metadata={metadata}
        />
      )}</td>
    </tr>
  );
}

export default React.memo(Unique);
