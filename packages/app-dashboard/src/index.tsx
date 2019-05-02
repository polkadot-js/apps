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

type Props = AppProps;
type State = {
  routes: Array<Route>
};

const Wrapper = styled.main`
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

export default class App extends React.PureComponent<Props, State> {
  // FIXME Atm we are not applying all the logic around should this be hidden or not, i.e.
  // is the api available, are there accounts, etc. (That logic should also be extracted so
  // it can be used in a proper way here)
  state: State = {
    routes: routing.routes.filter((route) =>
      route && !route.display.isHidden && route.name !== 'dashboard'
    ) as Array<Route>
  };

  render () {
    const { routes } = this.state;

    return (
      <Wrapper>
        <div className='routes'>
          {routes.map((route) =>
            <Entry
              key={route.name}
              route={route}
            />
          )}
          {routes.map((_, index) =>
            <Spacer key={index} />
          )}
        </div>
      </Wrapper>
    );
  }
}
