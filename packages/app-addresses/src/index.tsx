// Copyright 2017-2019 @polkadot/app-addresses authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';

import './index.css';

import React from 'react';

import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';

import Creator from './Creator';
import Editor from './Editor';
import translate from './translate';

type Props = I18nProps & {
  allAddresses?: SubjectInfo,
  basePath: string,
  onStatusChange: (status: ActionStatus) => void
};

type Actions = 'create' | 'edit';

type State = {
  action: Actions,
  hidden: Array<string>,
  items: Array<TabItem>
};

const Components: { [index: string]: React.ComponentType<any> } = {
  'create': Creator,
  'edit': Editor
};

class AddressesApp extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { allAddresses = {}, t } = props;
    const baseState = Object.keys(allAddresses).length !== 0
      ? AddressesApp.showEditState()
      : AddressesApp.hideEditState();

    this.state = {
      ...baseState,
      items: [
        {
          name: 'edit',
          text: t('app.edit', { defaultValue: 'Edit address' })
        },
        {
          name: 'create',
          text: t('app.create', { defaultValue: 'Add address' })
        }
      ]
    };
  }

  static showEditState () {
    return {
      action: 'edit' as Actions,
      hidden: []
    };
  }

  static hideEditState () {
    return {
      action: 'create' as Actions,
      hidden: ['edit']
    };
  }

  static getDerivedStateFromProps ({ allAddresses = {} }: Props, { hidden }: State) {
    const hasAddresses = Object.keys(allAddresses).length !== 0;

    if (hidden.length === 0) {
      return hasAddresses
        ? null
        : AddressesApp.hideEditState();
    }

    return hasAddresses
      ? AddressesApp.showEditState()
      : null;
  }

  render () {
    const { onStatusChange } = this.props;
    const { action, hidden, items } = this.state;
    const Component = Components[action];

    return (
      <main className='addresses--App'>
        <header>
          <Tabs
            activeItem={action}
            hidden={hidden}
            items={items}
            onChange={this.onMenuChange}
          />
        </header>
        <Component
          onCreateAddress={this.activateEdit}
          onStatusChange={onStatusChange}
        />
      </main>
    );
  }

  private onMenuChange = (action: Actions) => {
    this.setState({ action });
  }

  private activateEdit = (): void => {
    this.setState(
      AddressesApp.showEditState()
    );
  }
}

export default withMulti(
  AddressesApp,
  translate,
  withObservable(addressObservable.subject, { propName: 'allAddresses' })
);
