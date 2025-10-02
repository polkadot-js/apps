// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AugmentedBlockHeader } from '@polkadot/react-hooks/ctx/types';

import React from 'react';
import { Link } from 'react-router-dom';

import { AddressSmall, styled } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

interface Props {
  headers: AugmentedBlockHeader[];
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

function BlockHeader ({ headers }: Props): React.ReactElement<Props> | null {
  return (
    <>
      {headers.map((value, index) => {
        const hashHex = value.hash.toHex();

        return (
          <StyledTr
            className='isExpanded'
            isFirstItem={index === 0}
            isLastItem={index === headers.length - 1}
            key={value.number.toString()}
          >
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
            <td className='ui--Elapsed --digits'>
              {getDisplayValue(value.blockTime.toNumber() / 1000)}
            </td>
          </StyledTr>
        );
      })}
    </>
  );
}

const BASE_BORDER = 0.125;
const BORDER_TOP = `${BASE_BORDER * 3}rem solid var(--bg-page)`;
const BORDER_RADIUS = `${BASE_BORDER * 4}rem`;

const StyledTr = styled.tr<{isFirstItem: boolean; isLastItem: boolean}>`
  td {
    border-top: ${(props) => props.isFirstItem && BORDER_TOP};
    border-radius: 0rem !important;
    
    &:first-child {
      border-top-left-radius: ${(props) => props.isFirstItem ? BORDER_RADIUS : '0rem'}!important;
      border-bottom-left-radius: ${(props) => props.isLastItem ? BORDER_RADIUS : '0rem'}!important;
    }

    &:last-child {
      border-top-right-radius: ${(props) => props.isFirstItem ? BORDER_RADIUS : '0rem'}!important;
      border-bottom-right-radius: ${(props) => props.isLastItem ? BORDER_RADIUS : '0rem'}!important;
    }

    .timeUnit {
      font-size: var(--font-percent-tiny);
    }
  }
`;

export default React.memo(BlockHeader);
