// Copyright 2017-2018 @polkadot/app-addresses authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';

import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import Tabs from '@polkadot/ui-app/Tabs';
import withObservableBase from '@polkadot/ui-react-rx/with/observableBase';

import { hasNoAddresses } from './util/addresses';
import Creator from './Creator';
import Editor from './Editor';
import translate from './translate';

type Props = I18nProps & {
  addressAll?: Array<any>,
  basePath: string
};

type Actions = 'create' | 'edit';

type State = {
  action: Actions
};

// FIXME React-router would probably be the best route, not home-grown
const Components: { [index: string]: React.ComponentType<any> } = {
  'create': Creator,
  'edit': Editor
};

class AddressesApp extends React.PureComponent<Props, State> {
  state: State = { action: 'edit' };

  componentDidUpdate () {
    const { addressAll } = this.props;
    const { action } = this.state;

    if (action === 'edit' && hasNoAddresses(addressAll)) {
      this.selectCreate();
    }
  }

  render () {
    const { addressAll, t } = this.props;
    const { action } = this.state;
    const Component = Components[action];
    const items = [
      {
        name: 'edit',
        text: t('app.edit', { defaultValue: 'Edit address' })
      },
      {
        name: 'create',
        text: t('app.create', { defaultValue: 'Add address' })
      }
    ];

    // Do not load Editor tab if no addresses
    if (hasNoAddresses(addressAll)) {
      items.splice(0, 1);
    }

    return (
      <main className='addresses--App'>
        <header>
          <Tabs
            activeItem={action}
            items={items}
            onChange={this.onMenuChange}
          />
        </header>
        <Component onCreateAddress={this.selectEdit} />
      </main>
    );
  }

  onMenuChange = (action: Actions) => {
    this.setState({ action });
  }

  selectCreate = (): void => {
    this.setState({ action: 'create' });
  }

  selectEdit = (): void => {
    this.setState({ action: 'edit' });
  }
}

export default withObservableBase(
  addressObservable.subject, { propName: 'addressAll' }
)(translate(AddressesApp));
