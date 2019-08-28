/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AuthorityId, BlockNumber, EventRecord } from '@polkadot/types/interfaces';
import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { Route, Switch } from 'react-router';
import { createType, Option } from '@polkadot/types';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs, { TabItem } from '@polkadot/react-components/Tabs';
import { withCalls, withMulti, withObservable } from '@polkadot/react-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import './index.css';

import Accounts from './Actions/Accounts';
import basicMd from './md/basic.md';
import Overview from './Overview';
import translate from './translate';

type Props = AppProps & ApiProps & I18nProps & {
  allAccounts?: SubjectInfo;
  allStashesAndControllers?: [AccountId[], Option<AccountId>[]];
  chain_bestNumber?: BlockNumber;
  currentValidatorsControllersV1OrStashesV2?: AccountId[];
  recentlyOnline?: AuthorityId[];
};

interface State {
  allControllers: string[];
  allStashes: string[];
  currentValidatorsControllersV1OrStashesV2: string[];
  recentlyOnline: Record<string, BlockNumber>;
  tabs: TabItem[];
}

class App extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      allControllers: [],
      allStashes: [],
      currentValidatorsControllersV1OrStashesV2: [],
      recentlyOnline: {},
      tabs: [
        {
          isRoot: true,
          name: 'overview',
          text: t('Staking overview')
        },
        {
          name: 'actions',
          text: t('Account actions')
        }
      ]
    };
  }

  public static getDerivedStateFromProps (props: Props, state: State): Pick<State, never> {
    const { allStashesAndControllers = [[], []], chain_bestNumber, currentValidatorsControllersV1OrStashesV2 = [] } = props;

    const recentlyOnline: Record<string, BlockNumber> = {
      ...(state.recentlyOnline || {}),
      ...(props.recentlyOnline || []).reduce(
        (result: Record<string, BlockNumber>, authorityId): Record<string, BlockNumber> => ({
          ...result,
          [authorityId.toString()]: chain_bestNumber || createType('BlockNumber', new BN(0))
        }),
        {}
      )
    };

    return {
      allControllers: allStashesAndControllers[1].filter((optId): boolean => optId.isSome).map((accountId): string =>
        accountId.unwrap().toString()
      ),
      allStashes: allStashesAndControllers[0].filter((): boolean => true).map((accountId): string => accountId.toString()),
      currentValidatorsControllersV1OrStashesV2: currentValidatorsControllersV1OrStashesV2.map((authorityId): string =>
        authorityId.toString()
      ),
      recentlyOnline
    };
  }

  public render (): React.ReactNode {
    const { allAccounts, basePath } = this.props;
    const { tabs } = this.state;
    const hidden = !allAccounts || Object.keys(allAccounts).length === 0
      ? ['actions']
      : [];

    return (
      <main className='staking--App'>
        <HelpOverlay md={basicMd} />
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/actions`} render={this.renderComponent(Accounts)} />
          <Route render={this.renderComponent(Overview)} />
        </Switch>
      </main>
    );
  }

  private renderComponent (Component: React.ComponentType<ComponentProps>): () => React.ReactNode {
    return (): React.ReactNode => {
      const { allControllers, allStashes, currentValidatorsControllersV1OrStashesV2, recentlyOnline } = this.state;
      const { allAccounts } = this.props;

      if (!allAccounts) {
        return null;
      }

      return (
        <Component
          allAccounts={allAccounts}
          allControllers={allControllers}
          allStashes={allStashes}
          currentValidatorsControllersV1OrStashesV2={currentValidatorsControllersV1OrStashesV2}
          recentlyOnline={recentlyOnline}
        />
      );
    };
  }
}

export default withMulti(
  App,
  translate,
  withCalls<Props>(
    'derive.chain.bestNumber',
    ['derive.staking.controllers', { propName: 'allStashesAndControllers' }],
    ['query.session.validators', { propName: 'currentValidatorsControllersV1OrStashesV2' }],
    [
      'query.system.events',
      {
        propName: 'recentlyOnline',
        transform: (value?: EventRecord[]): AuthorityId[] =>
          (value || [])
            .filter(({ event: { method, section } }): boolean =>
              section === 'imOnline' && method === 'HeartbeatReceived'
            )
            .map(
              ({ event: { data: [authorityId] } }): AuthorityId => authorityId as AuthorityId
            )
      }
    ]
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
