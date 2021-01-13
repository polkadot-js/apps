import { AppProps as Props } from '@polkadot/react-components/types';
import { Columar, Column } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { Route, Switch } from 'react-router';
import styled from 'styled-components';

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
        <div style={{margin: '10px auto 0 auto', minWidth: '50%'}}>
          <Switch>
            <Route path={`${basePath}/status`}>
              <Status />
            </Route>
            <Route>
              <Swap />
            </Route>
          </Switch>
          <div>
            <a href="https://docs.dock.io/token-migration/migration-tutorial" target="_blank">Get help</a>
            {' '}
            <a href="/#/token-migration/status" style={{marginLeft: '20px'}}>Check request status</a>
          </div>
        </div>
      </Columar>
    </main>
  );
}

export default React.memo(styled(TokenSwapApp)`
  .copyMoved {
    position: absolute;
    top: 0.5rem;
  }
`);

export const migrationApiUrl = 'https://migration-api.dock.io';

/**
 * Remove prefix '0x' from a hex string if present. Doesn't check if string is valid hex or not
 * @param string
 */
export function removePrefixFromHex(string) {
  if (string.startsWith('0x')) {
    return string.slice(2);
  }
  return string;
}

/**
 * Returns true if bonus period is over
 */
export function hasBonusPeriodEnded() {
  // This value must match on the backend
  return new Date().getTime() > 1610409600000
}
