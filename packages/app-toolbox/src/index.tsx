// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';

import './index.css';

import React from 'react';
import Tabs from '@polkadot/ui-app/Tabs';

import Hash from './Hash';
import Sign from './Sign';
import Verify from './Verify';
import translate from './translate';

type Actions = 'hash' | 'sign' | 'verify';

type Props = I18nProps & {
  basePath: string,
  onStatusChange: (status: ActionStatus) => void
};

type State = {
  action: Actions
};

const Components: { [index: string]: React.ComponentType<any> } = {
  'hash': Hash,
  'sign': Sign,
  'verify': Verify
};

class ToolboxApp extends React.PureComponent<Props, State> {
  state: State = {
    action: 'hash'
  };

  render () {
    const { t } = this.props;
    const { action } = this.state;
    const Component = Components[action];
    const items = [
      {
        name: 'hash',
        text: t('app.hash', { defaultValue: 'Hash data' })
      },
      {
        name: 'sign',
        text: t('app.sign', { defaultValue: 'Sign message' })
      },
      {
        name: 'verify',
        text: t('app.verify', { defaultValue: 'Verify signature' })
      }
    ];

    return (
      <main className='toolbox--App'>
        <header>
          <Tabs
            activeItem={action}
            items={items}
            onChange={this.onMenuChange}
          />
        </header>
        <Component />
      </main>
    );
  }

  onMenuChange = (action: Actions) => {
    this.setState({ action });
  }
}

export default translate(ToolboxApp);
