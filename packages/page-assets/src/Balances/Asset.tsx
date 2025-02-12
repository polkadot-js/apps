// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetInfoComplete } from '@polkadot/react-hooks/types';

import React, { useMemo } from 'react';

import { styled } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import Account from './Account.js';
import useBalances from './useBalances.js';

interface Props {
  asset: AssetInfoComplete,
  className?: string;
  searchValue: string;
}

const Asset = ({ asset: { details, id, metadata }, className, searchValue }: Props) => {
  const balances = useBalances(id);

  const siFormat = useMemo(
    (): [number, string] => metadata
      ? [metadata.decimals.toNumber(), metadata.symbol.toUtf8().toUpperCase()]
      : [0, 'NONE'],
    [metadata]
  );

  const shouldShowAsset = useMemo(() => metadata.name.toUtf8().toLowerCase().includes(searchValue) ||
  formatNumber(id).toString().replaceAll(',', '').includes(searchValue), [id, metadata.name, searchValue]);

  if (!balances?.length || !shouldShowAsset) {
    return <></>;
  }

  return balances.map(({ account, accountId }, index) => {
    return (
      <StyledTr
        className={`isExpanded ${className}`}
        isFirstItem={index === 0}
        isLastItem={index === balances.length - 1}
        key={accountId}
      >
        <td className='all'>
          {index === 0 && <>{metadata.name.toUtf8()} ({formatNumber(id)})</>}
        </td>
        <Account
          account={account}
          accountId={accountId}
          assetId={id}
          key={accountId}
          minBalance={details.minBalance}
          siFormat={siFormat}
        />
      </StyledTr>
    );
  });
};

const BASE_BORDER = 0.125;
const BORDER_TOP = `${BASE_BORDER * 3}rem solid var(--bg-page)`;
const BORDER_RADIUS = `${BASE_BORDER * 4}rem`;

const StyledTr = styled.tr<{isFirstItem: boolean; isLastItem: boolean}>`
  td {
    border-top: ${(props) => props.isFirstItem && BORDER_TOP};
    border-radius: 0rem !important;
    
      &:first-child {
        padding-block: 1rem !important;
        border-top-left-radius: ${(props) => props.isFirstItem ? BORDER_RADIUS : '0rem'}!important;
        border-bottom-left-radius: ${(props) => props.isLastItem ? BORDER_RADIUS : '0rem'}!important;
      }

      &:last-child {
        border-top-right-radius: ${(props) => props.isFirstItem ? BORDER_RADIUS : '0rem'}!important;
        border-bottom-right-radius: ${(props) => props.isLastItem ? BORDER_RADIUS : '0rem'}!important;
      }
  }
`;

export default Asset;
