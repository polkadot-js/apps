// Copyright 2017-2024 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {AppProps as Props, TabItem} from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import { useTranslation } from './translate.js';
import WasmToEvm from './WasmToEvm/index.js'

function createItemsRef (t: (key: string, options?: { replace: Record<string, unknown> }) => string): TabItem[] {
  return [
    {
      isRoot: true,
      name: 'WasmToEVM',
      text: 'Wasm To EVM'
    },
    {
      name: 'EVMToWasm',
      text: 'EVM To Wasm'
    }
  ];
}

function AddressesApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const itemsRef = useRef(createItemsRef(t));

  return (
    <main>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Routes>
        <Route path={basePath}>
          <Route path={`${basePath}`} element={<WasmToEvm />} />
          <Route path={`${basePath}/evmToWasm`} element={<div>2</div>} />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(AddressesApp);
