// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AugmentedBlockHeader } from '@polkadot/react-hooks/ctx/types';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';

import BlockHeader from './BlockHeader.js';
import { useTranslation } from './translate.js';

interface Props {
  headers: AugmentedBlockHeader[];
}

function BlockHeaders ({ headers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('recent blocks'), 'start', 4]
  ]);

  const groupedByTimestamp = useMemo(() => {
    return headers.reduce((acc, product) => {
      const timestamp = product.timestamp.toString();

      if (!acc[timestamp]) {
        acc[timestamp] = [];
      }

      acc[timestamp].push(product);

      return acc;
    }, {} as Record<string, AugmentedBlockHeader[]>);
  }, [headers]);

  return (
    <Table
      empty={t('No blocks available')}
      header={headerRef.current}
    >
      {Object
        .entries(groupedByTimestamp)
        .map(([timestamp, headers]): React.ReactNode => {
          return (
            <BlockHeader
              headers={headers.filter((e) => !!e)}
              key={timestamp}
            />
          );
        })}
    </Table>
  );
}

export default React.memo(BlockHeaders);
