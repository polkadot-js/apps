// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React from 'react';
import { Route, Switch } from 'react-router';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs, { TabItem } from '@polkadot/react-components/Tabs';
import { withMulti, withObservable } from '@polkadot/react-api';

import basicMd from './md/basic.md';
import Overview from './Overview';
import translate from './translate';

interface Props extends AppProps, I18nProps {
  allAddresses?: SubjectInfo;
}

interface State {
  hidden: string[];
  items: TabItem[];
  isCreateOpen: boolean;
}

class AddressBookApp extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    const { allAddresses = {}, t } = props;
    const baseState = Object.keys(allAddresses).length !== 0
      ? AddressBookApp.showEditState()
      : AddressBookApp.hideEditState();

    this.state = {
      ...(baseState as State),
      isCreateOpen: false,
      items: [
        {
          isRoot: true,
          name: 'overview',
          text: t('My contacts')
        }
      ]
    };
  }

  private static showEditState (): Partial<State> {
    return {
      hidden: []
    };
  }

  private static hideEditState (): Partial<State> {
    return {
      hidden: ['edit']
    };
  }

  public static getDerivedStateFromProps ({ allAddresses = {} }: Props, { hidden }: State): State | null {
    const hasAddresses = Object.keys(allAddresses).length !== 0;

    if (hidden.length === 0) {
      return hasAddresses
        ? null
        : AddressBookApp.hideEditState() as State;
    }

    return hasAddresses
      ? AddressBookApp.showEditState() as State
      : null;
  }

  public render (): React.ReactNode {
    const { basePath } = this.props;
    const { hidden, items } = this.state;

    return (
      <main className='address-book--App'>
        <HelpOverlay md={basicMd} />
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={items}
          />
        </header>
        <Switch>
          <Route render={this.renderComponent(Overview)} />
        </Switch>
      </main>
    );
  }

  private renderComponent (Component: React.ComponentType<ComponentProps>): () => React.ReactNode {
    return (): React.ReactNode => {
      const { basePath, location, onStatusChange } = this.props;

      return (
        <Component
          basePath={basePath}
          location={location}
          onStatusChange={onStatusChange}
        />
      );
    };
  }
}

export default withMulti(
  AddressBookApp,
  translate,
  withObservable(addressObservable.subject, { propName: 'allAddresses' })
);
