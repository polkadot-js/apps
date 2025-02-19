// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ForeignAssetInfo } from '../useForeignAssetInfos.js';

import React, { useMemo } from 'react';

import { AddressSmall, CopyButton, Expander, styled } from '@polkadot/react-components';
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
        <Expander
          isLeft
          summary={JSON.stringify(location?.toJSON()).substring(0, 40)}
        >
          <pre>
            {JSON.stringify(location?.toJSON(), null, 2)}
          </pre>
        </Expander>
        <CopyButton value={JSON.stringify(location?.toJSON(), null, 2)} />
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
  display: flex;
  align-items: center;
  gap: 0.6rem;
  white-space: nowrap;
  font-style: italic;
  pre {
    overflow: visible;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .ui--Expander-summary svg {
    padding: 0.3rem 0.4rem;
    border-radius: 0.25rem;
    border: 1px solid var(--border-input);
  }
`;

export default React.memo(Asset);
