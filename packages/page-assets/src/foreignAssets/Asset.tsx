// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ForeignAssetInfo } from '../useForeignAssetInfos.js';

import React, { useMemo } from 'react';

import { AddressSmall, CopyButton, styled } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  className?: string;
  value: ForeignAssetInfo;
}

function Asset ({ className, value: { details, location, metadata } }: Props): React.ReactElement<Props> {
  const format = useMemo(
    (): [number, string] => metadata
      ? [metadata.decimals.toNumber(), metadata.symbol.toUtf8()]
      : [0, '---'],
    [metadata]
  );

  return (
    <tr className={className}>
      <Location>
        <CopyButton
          value={JSON.stringify(location?.toJSON(), null, 2)}
        >
          {JSON.stringify(location?.toJSON()).substring(0, 40)}
        </CopyButton>
      </Location>
      <td className='together'>{metadata?.name.toUtf8()}</td>
      <td className='address media--1000'>{details && <AddressSmall value={details.owner} />}</td>
      <td className='address media--1300'>{details && <AddressSmall value={details.admin} />}</td>
      <td className='address media--1600'>{details && <AddressSmall value={details.issuer} />}</td>
      <td className='address media--1900'>{details && <AddressSmall value={details.freezer} />}</td>
      <td className='number media--800'>{details && (
        <FormatBalance
          format={format}
          value={details.supply}
        />
      )}</td>
      <td className='number all'>{details?.accounts.toString() || '0'}</td>
    </tr>
  );
}

const Location = styled.td`
  .copyContainer {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-style: italic;
    white-space: nowrap;
  } 
`;

export default React.memo(Asset);
