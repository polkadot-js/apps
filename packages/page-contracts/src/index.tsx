// Copyright 2017-2023 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';

import { useTranslation } from '@polkadot/app-contracts/translate';
import { Tabs } from '@polkadot/react-components';

import Contracts from './Contracts.js';

function ContractsApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'contracts',
      text: t<string>('Contracts')
    }
  ]);

  return (
    <main className={`${className} contracts--App`}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Contracts />
    </main>
  );
}

export default React.memo(ContractsApp);
