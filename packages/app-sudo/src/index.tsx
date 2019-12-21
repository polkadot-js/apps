/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import { Icon, Tabs } from '@polkadot/react-components';
import { useCall, useAccounts, useApi } from '@polkadot/react-hooks';

import SetKey from './SetKey';
import Sudo from './Sudo';

import translate from './translate';

interface Props extends AppProps, I18nProps {
}

function SudoApp ({ basePath, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const sudoKey = useCall<string>(api.query.sudo.key, [], { transform: (k): string => k.toString() });
  const { allAccounts } = useAccounts();
  const [isMine, setIsMine] = useState(false);

  useEffect((): void => {
    setIsMine(!!sudoKey && allAccounts.some((key): boolean => key === sudoKey));
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

export default translate(SudoApp);
