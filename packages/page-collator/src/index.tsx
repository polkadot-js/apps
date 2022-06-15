// Copyright 2017-2022 @polkadot/app-collator authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Tabs } from '@polkadot/react-components';

import Collators from './Collators';
import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
}

function CollatorApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'index',
      text: t<string>('Overview')
    }
  ]);

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Collators />
    </main>
  );
}

export default React.memo(CollatorApp);
