// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import Hash from './Hash';
import { useTranslation } from './translate';
import useHashes from './useHashes';

interface Props {
  className?: string;
}

function Hashes ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const hashes = useHashes();

  const headerRef = useRef([
    [t('hashes'), 'start'],
    [t('size')],
    [t('status')]
  ]);

  return (
    <Table
      className={className}
      empty={hashes && t<string>('No hashes found')}
      header={headerRef.current}
    >
      {hashes && hashes.map((h) => (
        <Hash
          key={h}
          value={h}
        />
      ))}
    </Table>
  );
}

export default React.memo(Hashes);
