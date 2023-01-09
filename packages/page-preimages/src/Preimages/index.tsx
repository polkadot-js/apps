// Copyright 2017-2023 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Button, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import usePreimageIsLatest from '../usePreimageIsLatest';
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
  const isLatest = usePreimageIsLatest();
  const hashes = usePreimages();

  const header = useMemo<([React.ReactNode?, string?, number?] | false)[]>(
    () => [
      [t('preimages'), 'start', 2],
      [undefined, 'media--1300'],
      [isLatest ? t('length') : undefined, 'media--1000'],
      [isLatest ? t('status') : undefined, 'start media--1200']
    ], [isLatest, t]
  );

  return (
    <div className={className}>
      <Summary hashes={hashes} />
      <Button.Group>
        <Add />
      </Button.Group>
      <Table
        className={className}
        empty={hashes && t<string>('No hashes found')}
        header={header}
      >
        {hashes && hashes.map((h) => (
          <Preimage
            isLatest={isLatest}
            key={h}
            value={h}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(Hashes)`
  td.preimage-status {
    div+.ui--Button {
      margin-top: 0.25rem;
    }
  }
`);
