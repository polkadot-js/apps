// Copyright 2017-2025 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';

import React, { useRef } from 'react';

import { Tabs } from '@polkadot/react-components';

import CrustFiles from './CrustFiles.js';
import { useTranslation } from './translate.js';

interface Props {
  basePath: string;
  className?: string;
  newEvents?: KeyedEvent[];
}

function FilesApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'crust',
      text: t('Your Files')
    }
  ]);

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <CrustFiles />
    </main>
  );
}

export default React.memo(FilesApp);
