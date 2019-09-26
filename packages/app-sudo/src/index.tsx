/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import { Icon, Tabs } from '@polkadot/react-components';
import { withCalls, withMulti, withObservable } from '@polkadot/react-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import SetKey from './SetKey';
import Sudo from './Sudo';

import translate from './translate';

interface Props extends AppProps, I18nProps {
  allAccounts: SubjectInfo;
  sudoKey?: string;
}

function App ({ allAccounts, basePath, sudoKey, t }: Props): React.ReactElement<Props> {
  const [isMine, setIsMine] = useState(false);

  useEffect((): void => {
    setIsMine(
      !!sudoKey && !!allAccounts && Object.keys(allAccounts).some((key): boolean => key === sudoKey)
    );
  }, [allAccounts, sudoKey]);

  const _renderComponent = (Component: React.ComponentType<ComponentProps>): () => React.ReactNode => {
    // eslint-disable-next-line react/display-name
    return (): React.ReactNode => {
      return (
        <Component
          allAccounts={allAccounts}
          sudoKey={sudoKey}
          isMine={isMine}
        />
      );
    };
  };

  return (
    <main>
      <header>
        <Tabs
          basePath={basePath}
          items={[
            {
              isRoot: true,
              name: 'index',
              text: t('Sudo access')
            },
            {
              name: 'key',
              text: t('Set sudo key')
            }
          ]}
        />
      </header>
      {isMine
        ? (
          <Switch>
            <Route path={`${basePath}/key`} render={_renderComponent(SetKey)} />
            <Route render={_renderComponent(Sudo)} />
          </Switch>
        )
        : (
          <article className='error padded'>
            <div>
              <Icon name='ban' />
              {t('You do not have access to the current sudo key')}
            </div>
          </article>
        )
      }
    </main>
  );
}

export default withMulti(
  App,
  translate,
  withCalls<Props>(
    ['query.sudo.key', {
      propName: 'sudoKey',
      transform: (key): string =>
        key.toString()
    }]
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
