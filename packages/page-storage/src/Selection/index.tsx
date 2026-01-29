// Copyright 2017-2025 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParitalQueryTypes, QueryTypes } from '../types.js';

import React, { useCallback, useRef } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Consts from './Consts.js';
import Modules from './Modules.js';
import Raw from './Raw.js';

interface Props {
  basePath: string;
  onAdd: (query: QueryTypes) => void;
}

let id = -1;

function Selection ({ basePath, onAdd }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'modules',
      text: t('Storage')
    },
    {
      name: 'constants',
      text: t('Constants')
    },
    {
      name: 'raw',
      text: t('Raw storage')
    }
  ]);

  const _onAdd = useCallback(
    (query: ParitalQueryTypes) => onAdd({ ...query, id: ++id }),
    [onAdd]
  );

  return (
    <>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Consts onAdd={_onAdd} />
            }
            path='constants'
          />
          <Route
            element={
              <Raw onAdd={_onAdd} />
            }
            path='raw'
          />
          <Route
            element={
              <Modules onAdd={_onAdd} />
            }
            index
          />
        </Route>
      </Routes>
    </>
  );
}

export default React.memo(Selection);
