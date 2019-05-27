// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import './index.css';

import React from 'react';
import { Route, Switch } from 'react-router';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { HelpOverlay } from '@polkadot/ui-app';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import { withMulti, withObservable } from '@polkadot/ui-api';

import basicMd from './md/basic.md';
import CreateModal from './modals/Create';
import Creator from './Creator';
import Editor from './Editor';
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
          name: 'edit',
          text: t('Edit contact')
        },
        {
          name: 'create',
          text: t('Add contact')
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
    const { basePath, onStatusChange } = this.props;
    const { hidden, isCreateOpen, items } = this.state;
    const renderCreator = this.renderComponent(Creator);

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
          <Route path={`${basePath}/create`} render={renderCreator} />
          <Route
            render={
              hidden.includes('edit')
                ? renderCreator
                : this.renderComponent(Editor)
            }
          />
        </Switch>
        {isCreateOpen && (
          <CreateModal
            onClose={this.toggleCreate}
            onStatusChange={onStatusChange}
          />
        )}
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

  private toggleCreate = (): void => {
    this.setState(({ isCreateOpen }) => ({
      isCreateOpen: !isCreateOpen
    }));
  }
}

export default withMulti(
  AddressBookApp,
  translate,
  withObservable(addressObservable.subject, { propName: 'allAddresses' })
);
