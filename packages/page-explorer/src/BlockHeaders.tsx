// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import BlockHeader from './BlockHeader.js';
import { useTranslation } from './translate.js';

interface Props {
  headers: HeaderExtended[];
}

function BlockHeaders ({ headers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('recent blocks'), 'start', 3]
  ]);

  return (
    <Table
      empty={t('No blocks available')}
      header={headerRef.current}
    >
      {headers
        .filter((header) => !!header)
        .map((header): React.ReactNode => (
          <BlockHeader
            key={header.number.toString()}
            value={header}
          />
        ))}
    </Table>
  );
}

export default React.memo(BlockHeaders);
