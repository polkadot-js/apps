// Copyright 2017-2025 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import useHashes from '../useHashes.js';
import Details from './Details.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  defaultPropose?: SubmittableExtrinsicFunction<'promise'>;
  filter?: (section: string, method?: string) => boolean;
}

function Hashes ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const hashes = useHashes();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('calls'), 'start'],
    [undefined, 'all'],
    [undefined, 'media--1300']
  ]);

  return (
    <div className={className}>
      <Summary hashes={hashes} />
      <Table
        className={className}
        empty={hashes && t('No call hashes found')}
        header={headerRef.current}
      >
        {hashes?.map((h) => (
          <Details
            key={h}
            value={h}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Hashes);
