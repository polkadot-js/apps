// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AuthorityId, BlockNumber, EventRecord } from '@polkadot/types/interfaces';
import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import styled from 'styled-components';
import { createType, Option } from '@polkadot/types';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { withCalls, withMulti, withObservable } from '@polkadot/react-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import './index.css';

import Accounts from './Actions/Accounts';
import basicMd from './md/basic.md';
import Overview from './Overview';
import translate from './translate';

interface Props extends AppProps, ApiProps, I18nProps {
  allAccounts?: SubjectInfo;
  allStashesAndControllers?: [AccountId[], Option<AccountId>[]];
  bestNumber?: BlockNumber;
  currentValidatorsControllersV1OrStashesV2?: AccountId[];
  recentlyOnline?: AuthorityId[];
}

interface State {
  allControllers: string[];
  allStashes: string[];
  currentValidators: string[];
  recentlyOnline: Record<string, BlockNumber>;
}

function App ({ allAccounts, allStashesAndControllers = [[], []], bestNumber, className, currentValidatorsControllersV1OrStashesV2 = [], basePath, recentlyOnline: propsRecentlyOnline, t }: Props): React.ReactElement<Props> {
  const [{ allControllers, allStashes, currentValidators, recentlyOnline }, setState] = useState<State>({
    allControllers: [],
    allStashes: [],
    currentValidators: [],
    recentlyOnline: {}
  });

  useEffect((): void => {
    setState({
      allControllers: allStashesAndControllers[1]
        .filter((optId): boolean => optId.isSome)
        .map((accountId): string => accountId.unwrap().toString()),
      allStashes: allStashesAndControllers[0]
        .filter((): boolean => true)
        .map((accountId): string => accountId.toString()),
      currentValidators: currentValidatorsControllersV1OrStashesV2.map((authorityId): string =>
        authorityId.toString()
      ),
      recentlyOnline: {
        ...(recentlyOnline || {}),
        ...(propsRecentlyOnline || []).reduce(
          (result: Record<string, BlockNumber>, authorityId): Record<string, BlockNumber> => ({
            ...result,
            [authorityId.toString()]: bestNumber || createType('BlockNumber', new BN(0))
          }),
          {}
        )
      }
    });
  }, [allStashesAndControllers, bestNumber, currentValidatorsControllersV1OrStashesV2]);

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
          recentlyOnline={recentlyOnline}
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
    ['derive.staking.controllers', { propName: 'allStashesAndControllers' }],
    ['query.session.validators', { propName: 'currentValidatorsControllersV1OrStashesV2' }],
    ['query.system.events', {
      propName: 'recentlyOnline',
      transform: (value?: EventRecord[]): AuthorityId[] =>
        (value || [])
          .filter(({ event: { method, section } }): boolean =>
            section === 'imOnline' && method === 'HeartbeatReceived'
          )
          .map(({ event: { data: [authorityId] } }): AuthorityId =>
            authorityId as AuthorityId
          )
    }]
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
