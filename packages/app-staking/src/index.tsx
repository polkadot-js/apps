// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BlockNumber, EventRecord } from '@polkadot/types/interfaces';
import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React, { useEffect, useReducer } from 'react';
import { Route, Switch } from 'react-router';
import styled from 'styled-components';
import { Option } from '@polkadot/types';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { withCalls, withMulti, withObservable } from '@polkadot/react-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import Accounts from './Actions/Accounts';
import basicMd from './md/basic.md';
import Overview from './Overview';
import translate from './translate';

interface Props extends AppProps, ApiProps, I18nProps {
  allAccounts?: SubjectInfo;
  allStashesAndControllers?: [string[], string[]];
  bestNumber?: BlockNumber;
  currentValidators?: string[];
  recentlyOnline?: string[];
}

const EMPY_ACCOUNTS: string[] = [];
const EMPTY_ALL: [string[], string[]] = [EMPY_ACCOUNTS, EMPY_ACCOUNTS];

function offlineReducer (prev: Record<string, BlockNumber>, { bestNumber, recentlyOnline }: { bestNumber: BlockNumber; recentlyOnline: string[] }): Record<string, BlockNumber> {
  return {
    ...prev,
    ...recentlyOnline.reduce(
      (result: Record<string, BlockNumber>, authorityId): Record<string, BlockNumber> => ({
        ...result,
        [authorityId]: bestNumber
      }),
      {}
    )
  };
}

function App ({ allAccounts, allStashesAndControllers: [allStashes, allControllers] = EMPTY_ALL, bestNumber, className, currentValidators = EMPY_ACCOUNTS, basePath, recentlyOnline, t }: Props): React.ReactElement<Props> {
  const [online, dispatchOffline] = useReducer(offlineReducer, {});

  // dispatch a combinator for the new recentlyOnline events
  useEffect((): void => {
    if (bestNumber && recentlyOnline && recentlyOnline.length) {
      dispatchOffline({ bestNumber, recentlyOnline });
    }
  }, [bestNumber, recentlyOnline]);

  const _renderComponent = (Component: React.ComponentType<ComponentProps>): () => React.ReactNode => {
    // eslint-disable-next-line react/display-name
    return (): React.ReactNode => {
      if (!allAccounts) {
        return null;
      }

      return (
        <Component
          allAccounts={allAccounts}
          allControllers={allControllers}
          allStashes={allStashes}
          currentValidators={currentValidators}
          recentlyOnline={online}
        />
      );
    };
  };

  return (
    <main className={`staking--App ${className}`}>
      <HelpOverlay md={basicMd} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            !allAccounts || Object.keys(allAccounts).length === 0
              ? ['actions']
              : []
          }
          items={[
            {
              isRoot: true,
              name: 'overview',
              text: t('Staking overview')
            },
            {
              name: 'actions',
              text: t('Account actions')
            }
          ]}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/actions`} render={_renderComponent(Accounts)} />
        <Route render={_renderComponent(Overview)} />
      </Switch>
    </main>
  );
}

export default withMulti(
  styled(App)`
    .rx--updated {
      background: transparent !important;
    }
  `,
  translate,
  withCalls<Props>(
    ['derive.chain.bestNumber', { propName: 'bestNumber' }],
    ['derive.staking.controllers', {
      propName: 'allStashesAndControllers',
      transform: ([stashes, controllers]: [AccountId[], Option<AccountId>[]]): [string[], string[]] => [
        stashes.map((accountId): string => accountId.toString()),
        controllers
          .filter((optId): boolean => optId.isSome)
          .map((accountId): string => accountId.unwrap().toString())
      ]
    }],
    ['query.session.validators', {
      propName: 'currentValidators',
      transform: (validators: AccountId[]): string[] =>
        validators.map((accountId): string => accountId.toString())
    }],
    ['query.system.events', {
      propName: 'recentlyOnline',
      transform: (value?: EventRecord[]): string[] =>
        (value || [])
          .filter(({ event: { method, section } }): boolean =>
            section === 'imOnline' && method === 'HeartbeatReceived'
          )
          .map(({ event: { data: [authorityId] } }): string =>
            authorityId.toString()
          )
    }]
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
