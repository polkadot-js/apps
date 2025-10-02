// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AugmentedBlockHeader } from '@polkadot/react-hooks/ctx/types';

import React from 'react';
import { Link } from 'react-router-dom';

import { AddressSmall, styled } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

interface Props {
  value: AugmentedBlockHeader;
}

function formatValue (value: number, type = 's', withDecimal = false): React.ReactNode {
  const [pre, post] = value.toLocaleString('fullwide', { useGrouping: false }).split('.');

  return withDecimal && post?.trim()?.length > 0
    ? <>{pre}.{post}<span className='timeUnit'>{type}</span></>
    : <>{pre}<span className='timeUnit'>{type}</span></>;
}

function getDisplayValue (elapsed: number): React.ReactNode {
  return (elapsed < 60)
    ? formatValue(elapsed, 's', elapsed < 15)
    : (elapsed < 3600)
      ? formatValue(elapsed / 60, 'min')
      : formatValue(elapsed / 3600, 'hr');
}

function BlockHeader ({ value }: Props): React.ReactElement<Props> | null {
  if (!value) {
    return null;
  }

  const hashHex = value.hash.toHex();

  return (
    <tr>
      <td className='number'>
        <h4 className='--digits'>
          <Link to={`/explorer/query/${hashHex}`}>{formatNumber(value.number)}</Link>
        </h4>
      </td>
      <td className='all hash overflow'>{hashHex}</td>
      <td className='address'>
        {value.author && (
          <AddressSmall value={value.author} />
        )}
      </td>
      <StyledTd className='ui--Elapsed --digits'>
        {getDisplayValue(value.blockTime.toNumber() / 1000)}
      </StyledTd>
    </tr>
  );
}

const StyledTd = styled.td`
  .timeUnit {
    font-size: var(--font-percent-tiny);
  }
`;

export default React.memo(BlockHeader);
