// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';
import { QueryTypes, ParitalQueryTypes } from '../types';

import React from 'react';
import { Tabs } from '@polkadot/ui-app/index';

import Modules from './Modules';
import Raw from './Raw';
import translate from '../translate';

type Actions = 'modules' | 'raw';

type Props = I18nProps & {
  onAdd: (query: QueryTypes) => void
};

type State = {
  action: Actions,
  items: Array<TabItem>
};

const Components: { [index: string]: React.ComponentType<any> } = {
  'modules': Modules,
  'raw': Raw
};

let id = -1;

class Selection extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const { t } = this.props;

    this.state = {
      action: 'modules',
      items: [
        {
          name: 'modules',
          text: t('Modules')
        },
        {
          name: 'raw',
          text: t('Raw key')
        }
      ]
    };
  }

  render () {
    const { action, items } = this.state;
    const Component = Components[action];

    return (
      <>
        <header>
          <Tabs
            activeItem={action}
            items={items}
            onChange={this.onTabChange}
          />
        </header>
        <Component onAdd={this.onAdd} />
      </>
    );
  }

  private onAdd = (query: ParitalQueryTypes) => {
    const { onAdd } = this.props;

    onAdd({
      ...query,
      id: ++id
    });
  }

  private onTabChange = (action: Actions) => {
    this.setState({ action });
  }
}

export default translate(Selection);
