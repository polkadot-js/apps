// Copyright 2017-2019 @polkadot/app-dashboard authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from '@polkadot/apps-routing/types';
import { AppProps } from '@polkadot/ui-app/types';

import React from 'react';
import styled from 'styled-components';
import routing from '@polkadot/apps-routing';

import Entry from './Entry';
import Spacer from './Spacer';

interface Props extends AppProps {
  className?: string;
}

interface State {
  routes: Route[];
}

class App extends React.PureComponent<Props, State> {
  // FIXME Atm we are not applying all the logic around should this be hidden or not, i.e.
  // is the api available, are there accounts, etc. (That logic should also be extracted so
  // it can be used in a proper way here)
  public state: State = {
    routes: routing.routes.filter((route): boolean =>
      !!route && !route.display.isHidden && route.name !== 'dashboard'
    ) as Route[]
  };

  public render (): React.ReactNode {
    const { className } = this.props;
    const { routes } = this.state;

    return (
      <main className={className}>
        <div className='routes'>
          {routes.map(this.renderEntry)}
          {routes.map(this.renderSpacer)}
        </div>
      </main>
    );
  }

  private renderEntry (route: Route) {
    return (
      <Entry
        key={route.name}
        route={route}
      />
    );
  }

  // NOTE: This _looks_ weird and it looks weird, because it is weird. Basically we want all
  // the entries of an equal width. So here we add a non-content spacers at the end that just
  // ensures flex has enough items to render something usable to the user. Since we don't
  // quite know how many items per row, we just render a bunch, n === routes.length
  private renderSpacer (route: Route, index: number) {
    return (
      <Spacer key={index} />
    );
  }
}

export default styled(App)`
  .routes {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;

    > div {
      flex: 1;
      padding: 1.5rem;
      text-align: center;
    }
  }
`;
