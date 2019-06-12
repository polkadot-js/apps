// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';
import { ComponentProps, QueryTypes, ParitalQueryTypes } from '../types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/ui-app';

import Modules from './Modules';
import Raw from './Raw';
import translate from '../translate';

type Props = I18nProps & {
  basePath: string,
  onAdd: (query: QueryTypes) => void
};

type State = {
  items: Array<TabItem>
};

let id = -1;

class Selection extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const { t } = this.props;

    this.state = {
      items: [
        {
          isRoot: true,
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
    const { basePath } = this.props;
    const { items } = this.state;

    return (
      <>
        <header>
          <Tabs
            basePath={basePath}
            items={items}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/raw`} render={this.renderComponent(Raw)} />
          <Route render={this.renderComponent(Modules)} />
        </Switch>
      </>
    );
  }

  private renderComponent (Component: React.ComponentType<ComponentProps>) {
    return (): React.ReactNode => {
      return (
        <Component onAdd={this.onAdd} />
      );
    };
  }

  private onAdd = (query: ParitalQueryTypes) => {
    const { onAdd } = this.props;

    onAdd({
      ...query,
      id: ++id
    });
  }
}

export default translate(Selection);
