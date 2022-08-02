// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';

import React, { useRef } from 'react';

import { Button, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import usePreimages from '../usePreimages';
import Add from './Add';
import Preimage from './Preimage';
import Summary from './Summary';

interface Props {
  className?: string;
  defaultPropose?: SubmittableExtrinsicFunction<'promise'>;
  filter?: (section: string, method?: string) => boolean;
}

function Hashes ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const hashes = usePreimages();

  const headerRef = useRef([
    [t('preimages'), 'start', 2],
    [t('size')],
    [t('status')],
    [t('count')]
  ]);

  return (
    <div className={className}>
      <Summary hashes={hashes} />
      <Button.Group>
        <Add />
      </Button.Group>
      <Table
        className={className}
        empty={hashes && t<string>('No hashes found')}
        header={headerRef.current}
      >
        {hashes && hashes.map((h) => (
          <Preimage
            key={h}
            value={h}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Hashes);
