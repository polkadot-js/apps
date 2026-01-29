// Copyright 2017-2025 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Routes } from 'react-router';

import { Icon, Tabs } from '@polkadot/react-components';
import { useSudo } from '@polkadot/react-hooks';

import SetKey from './SetKey.js';
import Sudo from './Sudo.js';
import { useTranslation } from './translate.js';

function SudoApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts, hasSudoKey, sudoKey } = useSudo();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'index',
      text: t('Sudo access')
    },
    {
      name: 'key',
      text: t('Set sudo key')
    }
  ]);

  return (
    <main>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      {hasSudoKey
        ? (
          <Routes>
            <Route path={basePath}>
              <Route
                element={
                  <SetKey
                    allAccounts={allAccounts}
                    isMine={hasSudoKey}
                    sudoKey={sudoKey}
                  />
                }
                path='key'
              />
              <Route
                element={
                  <Sudo
                    isMine={hasSudoKey}
                    sudoKey={sudoKey}
                  />
                }
                index
              />
            </Route>
          </Routes>
        )
        : (
          <article className='error padded'>
            <div>
              <Icon icon='ban' />
              {t('You do not have access to the current sudo key')}
            </div>
          </article>
        )
      }
    </main>
  );
}

export default React.memo(SudoApp);
