// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';
import { TabItem } from '@polkadot/react-components/Tabs';
import { ComponentProps, QueryTypes, ParitalQueryTypes } from '../types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';
import { withApi } from '@polkadot/react-api';

import Consts from './Consts';
import Modules from './Modules';
import Raw from './Raw';
import translate from '../translate';

interface Props extends ApiProps, I18nProps {
  basePath: string;
  onAdd: (query: QueryTypes) => void;
}

interface State {
  items: TabItem[];
}

let id = -1;

class Selection extends React.PureComponent<Props, State> {
  public constructor (props: Props) {
    super(props);

    const { t } = this.props;

    this.state = {
      items: [
        {
          isRoot: true,
          name: 'modules',
          text: t('Storage')
        },
        {
          name: 'constants',
          text: t('Constants')
        },
        {
          name: 'raw',
          text: t('Raw storage')
        }
      ]
    };
  }

  public render (): React.ReactNode {
    const { basePath, isSubstrateV2 } = this.props;
    const { items } = this.state;
    const hidden = isSubstrateV2 ? [] : ['constants'];

    return (
      <>
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={items}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/constants`} render={this.renderComponent(Consts)} />
          <Route path={`${basePath}/raw`} render={this.renderComponent(Raw)} />
          <Route render={this.renderComponent(Modules)} />
        </Switch>
      </>
    );
  }

  private renderComponent (Component: React.ComponentType<ComponentProps>): () => React.ReactNode {
    return (): React.ReactNode => {
      return (
        <Component onAdd={this.onAdd} />
      );
    };
  }

  private onAdd = (query: ParitalQueryTypes): void => {
    const { onAdd } = this.props;

    onAdd({
      ...query,
      id: ++id
    });
  }
}

export default translate(withApi(Selection));
