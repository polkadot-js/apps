// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Tabs } from '@polkadot/react-components';

import Bounties from './Bounties';
import { useTranslation } from './translate';

export { default as useCounter } from './useCounter';

interface Props {
  basePath: string;
  className?: string;
}

function BountiesApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'index',
      text: t<string>('Bounties')
    }
  ]);

  return (
    <main className={`bounties--App ${className}`}>
      <header>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
      </header>
      <Bounties/>
    </main>
  );
}

export default React.memo(BountiesApp);
