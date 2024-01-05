// Copyright 2017-2024 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';

import React, { useRef } from 'react';

import { Button, styled, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import usePreimages from '../usePreimages.js';
import Add from './Add/index.js';
import Preimage from './Preimage.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  defaultPropose?: SubmittableExtrinsicFunction<'promise'>;
  filter?: (section: string, method?: string) => boolean;
}

function Hashes ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const hashes = usePreimages();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('preimages'), 'start', 2],
    [undefined, 'media--1300'],
    [t('length'), 'media--1000'],
    [t('status'), 'start media--1200']
  ]);

  return (
    <StyledDiv className={className}>
      <Summary hashes={hashes} />
      <Button.Group>
        <Add />
      </Button.Group>
      <Table
        className={className}
        empty={hashes && t('No hashes found')}
        header={headerRef.current}
      >
        {hashes?.map((h) => (
          <Preimage
            key={h}
            value={h}
          />
        ))}
      </Table>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  td.preimageStatus {
    div+.ui--Button {
      margin-top: 0.25rem;
    }
  }
`;

export default React.memo(Hashes);
