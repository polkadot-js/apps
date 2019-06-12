// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React from 'react';
import { Route, Switch } from 'react-router';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { HelpOverlay } from '@polkadot/ui-app';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import { withMulti, withObservable } from '@polkadot/ui-api';

import basicMd from './md/basic.md';
import Overview from './Overview';
import translate from './translate';

type Props = AppProps & I18nProps & {
  allAddresses?: SubjectInfo
};

type State = {
  hidden: Array<string>,
  items: Array<TabItem>,
  isCreateOpen: boolean
};

class AddressBookApp extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { allAddresses = {}, t } = props;
    const baseState = Object.keys(allAddresses).length !== 0
      ? AddressBookApp.showEditState()
      : AddressBookApp.hideEditState();

    this.state = {
      ...baseState,
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

  static showEditState () {
    return {
      hidden: []
    };
  }

  static hideEditState () {
    return {
      hidden: ['edit']
    };
  }

  static getDerivedStateFromProps ({ allAddresses = {} }: Props, { hidden }: State) {
    const hasAddresses = Object.keys(allAddresses).length !== 0;

    if (hidden.length === 0) {
      return hasAddresses
        ? null
        : AddressBookApp.hideEditState();
    }

    return hasAddresses
      ? AddressBookApp.showEditState()
      : null;
  }

  render () {
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

  private renderComponent (Component: React.ComponentType<ComponentProps>) {
    return () => {
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
