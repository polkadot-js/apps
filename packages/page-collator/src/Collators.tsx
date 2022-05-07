// Copyright 2017-2022 @polkadot/app-collator authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { BlockAuthorsContext } from '@polkadot/react-query';

import Collator from './Collator';
import Summary from './Summary';
import { useTranslation } from './translate';
import useCollators from './useCollators';

interface Props {
  className?: string;
}

function Collators ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const collators = useCollators();
  const { byAuthor } = useContext(BlockAuthorsContext);

  const hdrRef = useRef([
    [t<string>('collators'), 'start', 2],
    [t<string>('deposit'), 'number'],
    [t<string>('balance'), 'number'],
    [t<string>('last #'), 'number']
  ]);

  return (
    <div className={className}>
      <Summary />
      <Table
        empty={collators && t<string>('No running collators')}
        header={hdrRef.current}
      >
        {collators && collators.map((c) => (
          <Collator
            info={c}
            key={c.accountId}
            lastBlock={byAuthor[c.accountId]}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Collators);
