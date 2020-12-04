import { AppProps as Props } from '@polkadot/react-components/types';
import { Columar, Column } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { Route, Switch } from 'react-router';

import React, { useContext, useRef } from 'react';

import Swap from './Swap';
import Status from './Status';
import { useTranslation } from './translate';

function TokenSwapApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'migrate',
      text: t<string>('Migrate tokens')
    },
    {
      name: 'status',
      text: t<string>('Check status')
    },
  ]);

  return (
    <main className='master-submit--App'>
      <header>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
      </header>
      <Columar>
        <Column style={{margin: '10px auto 0 auto'}}>
          <Switch>
            <Route path={`${basePath}/status`}>
              <Status />
            </Route>
            <Route>
              <Swap />
            </Route>
          </Switch>
          <div>
            <a href="#" target="_blank">Get help</a>
            {' '}
            <a href="/#/token-swap/status" style={{marginLeft: '20px'}}>Check request status</a>
          </div>
        </Column>
      </Columar>
    </main>
  );
}

<Columar>
  <Column>
    <Swap />
  </Column>
  <Column>
    <Status />
  </Column>
</Columar>
export default React.memo(TokenSwapApp);
