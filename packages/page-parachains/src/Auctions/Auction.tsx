// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex, BlockNumber } from '@polkadot/types/interfaces';
import type { Winning } from './types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import WinBlock from './WinBlock';

interface Props {
  className?: string;
  endBlock: BlockNumber | null;
  numAuctions: AuctionIndex | null;
  winningData: Winning[] | null;
}

function Auction ({ className, endBlock, numAuctions, winningData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('winners'), 'start', 4],
    [t('range'), 'start'],
    [t('value'), 'number']
  ]);

  return (
    <Table
      className={className}
      empty={numAuctions && winningData && (
        endBlock && !winningData.length
          ? t<string>('No winners in this auction')
          : t<string>('No ongoing auction')
      )}
      header={headerRef.current}
    >
      {endBlock && winningData?.map((value, count) => (
        <WinBlock
          endBlock={endBlock}
          isEven={!!(count % 2)}
          isLatest={count === 0}
          key={value.blockNumber.toString()}
          value={value}
        />
      ))}
    </Table>
  );
}

export default React.memo(Auction);
