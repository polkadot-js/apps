// Copyright 2017-2025 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props, TabItem } from '@polkadot/react-components/types';
import type { DecodedExtrinsic } from './types.js';

import React, { useRef, useState } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Decoder from './Decoder.js';
import Submission from './Submission.js';
import { useTranslation } from './translate.js';

function createItemsRef (t: (key: string, options?: { replace: Record<string, unknown> }) => string): TabItem[] {
  return [
    {
      isRoot: true,
      name: 'create',
      text: t('Submission')
    },
    {
      hasParams: true,
      name: 'decode',
      text: t('Decode')
    }
  ];
}

function ExtrinsicsApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [decoded, setDecoded] = useState<DecodedExtrinsic | null>(null);
  const itemsRef = useRef(createItemsRef(t));

  return (
    <main className='extrinsics--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Decoder
                defaultValue={decoded?.hex}
                setLast={setDecoded}
              />
            }
            path='decode/:encoded?'
          />
          <Route
            element={
              <Submission defaultValue={decoded} />
            }
            index
          />
        </Route>
      </Routes>
    </main>
  );
}

export { ExtrinsicsApp };

export default React.memo(ExtrinsicsApp);
