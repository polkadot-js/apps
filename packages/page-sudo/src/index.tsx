// Copyright 2017-2020 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';
import { Icon, Tabs } from '@polkadot/react-components';
import { useSudo } from '@polkadot/react-hooks';

import SetKey from './SetKey';
import Sudo from './Sudo';

import { useTranslation } from './translate';

function SudoApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts, isMine, sudoKey } = useSudo();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'index',
      text: t<string>('Sudo access')
    },
    {
      name: 'key',
      text: t<string>('Set sudo key')
    }
  ]);

  return (
    <main>
      <header>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
      </header>
      {isMine
        ? (
          <Switch>
            <Route path={`${basePath}/key`}>
              <SetKey
                allAccounts={allAccounts}
                isMine={isMine}
                sudoKey={sudoKey}
              />
            </Route>
            <Route>
              <Sudo
                allAccounts={allAccounts}
                isMine={isMine}
                sudoKey={sudoKey}
              />
            </Route>
          </Switch>
        )
        : (
          <article className='error padded'>
            <div>
              <Icon icon='ban' />
              {t<string>('You do not have access to the current sudo key')}
            </div>
          </article>
        )
      }
    </main>
  );
}

export default React.memo(SudoApp);
