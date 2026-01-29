// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Tabs } from '@polkadot/react-components';

import Bounties from './Bounties.js';
import { useTranslation } from './translate.js';

export { default as useCounter } from './useCounter.js';

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
      text: t('Overview')
    }
  ]);

  return (
    <main className={`${className} bounties--App`}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Bounties />
    </main>
  );
}

export default React.memo(BountiesApp);
