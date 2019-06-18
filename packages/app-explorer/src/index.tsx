// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/ui-app/types';
import { KeyedEvent } from './types';

import './index.css';

import React from 'react';
import { Route, Switch } from 'react-router';
import styled from 'styled-components';
import { EventRecord } from '@polkadot/types';
import { withCalls, withMulti } from '@polkadot/ui-api';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import uiSettings from '@polkadot/ui-settings';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

import { MAX_ITEMS } from './BlockHeaders';
import BlockInfo from './BlockInfo';
import Main from './Main';
import NodeInfo from './NodeInfo';
import translate from './translate';

type Props = AppProps & BareProps & I18nProps & {
  system_events?: Array<EventRecord>
};

type State = {
  items: Array<TabItem>,
  prevEventHash: string;
  recentEvents: Array<KeyedEvent>;
};

class ExplorerApp extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);

    const { t } = this.props;

    this.state = {
      items: [
        {
          isRoot: true,
          name: 'chain',
          text: t('Chain info')
        },
        {
          hasParams: true,
          name: 'query',
          text: t('Block details')
        },
        {
          name: 'node',
          text: t('Node info')
        }
      ],
      prevEventHash: '',
      recentEvents: []
    };
  }

  // assign the events on the index - this way we keep a record of these, even when swapping
  // tabs withing this app, all the events as received will be shown
  static getDerivedStateFromProps ({ system_events = [] }: Props, prevState: State): State | null {
    const prevEventHash = xxhashAsHex(stringToU8a(JSON.stringify(system_events)));

    if (prevEventHash === prevState.prevEventHash) {
      return null;
    }

    const recentEvents = system_events
      .filter(({ event }) => event.section !== 'system')
      .map((record, index) => ({ key: `${Date.now()}-${index}`, record }))
      .concat(prevState.recentEvents)
      .filter((_, index) => index < MAX_ITEMS);

    return {
      items: prevState.items,
      prevEventHash,
      recentEvents
    };
  }

  render () {
    const { basePath, className } = this.props;
    const { items } = this.state;
    const hidden = uiSettings.uiMode === 'full'
      ? []
      : ['node'];

    return (
      <main className={className}>
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={items}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/query/:value`} component={BlockInfo} />
          <Route path={`${basePath}/query`} component={BlockInfo} />
          <Route path={`${basePath}/node`} component={NodeInfo} />
          <Route component={this.renderMain} />
        </Switch>
      </main>
    );
  }

  private renderMain = () => {
    const { recentEvents } = this.state;

    return (
      <Main events={recentEvents} />
    );
  }
}

export default withMulti(
  styled(ExplorerApp as React.ComponentClass<Props>)`
    .rx--updated {
      background: transparent !important;
    }
  `,
  translate,
  withCalls<Props>('query.system.events')
);
