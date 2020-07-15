// Copyright 2017-2020 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { Icon, Tabs } from '@polkadot/react-components';
import { useSudo } from '@polkadot/react-hooks';

import SetKey from './SetKey';
import Sudo from './Sudo';

import { useTranslation } from './translate';

function SudoApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts, isMine, sudoKey } = useSudo();
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'index',
      text: t<string>('Sudo access')
    },
    {
      name: 'key',
      text: t<string>('Set sudo key')
    }
  ], [t]);

  return (
    <main>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
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
