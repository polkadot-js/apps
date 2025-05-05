// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Preimage as TPreimage } from '@polkadot/react-hooks/types';

import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Button, styled, Table } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import usePreimages from '../usePreimages.js';
import Add from './Add/index.js';
import UserPreimages from './userPreimages/index.js';
import Preimage from './Preimage.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  defaultPropose?: SubmittableExtrinsicFunction<'promise'>;
  filter?: (section: string, method?: string) => boolean;
}

function Hashes ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const [allPreImagesInfo, setAllPreImagesInfo] = useState<TPreimage[]>([]);
  const hashes = usePreimages();

  // HACK to concat all preimages info without creating a new hook, just for multiple hashes
  const onSetAllPreImagesInfo = useCallback((info: TPreimage) => {
    setAllPreImagesInfo((preimages) => ([
      ...preimages.filter((e) => e.proposalHash !== info.proposalHash),
      info
    ]));
  }, []);

  const groupedUserPreimages = useMemo(() => {
    return allPreImagesInfo.reduce((result: Record<string, TPreimage[]>, current) => {
      if (current.deposit?.who && allAccounts.includes(current.deposit?.who)) {
        const newItems = [...(result[current.deposit?.who] || []), current];

        result[current.deposit?.who] = newItems;
      }

      return result;
    }, {} as Record<string, TPreimage[]>);
  }, [allAccounts, allPreImagesInfo]);

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
      <UserPreimages userPreimages={groupedUserPreimages} />
      <Table
        className={className}
        empty={hashes && t('No hashes found')}
        header={headerRef.current}
      >
        {hashes?.map((h) => (
          <Preimage
            cb={onSetAllPreImagesInfo}
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
