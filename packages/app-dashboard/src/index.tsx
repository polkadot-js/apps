// Copyright 2017-2020 @polkadot/app-dashboard authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from '@polkadot/apps-routing/types';
import { AppProps } from '@polkadot/react-components/types';

import React, { useState } from 'react';
import styled from 'styled-components';
import routing from '@polkadot/apps-routing';

import Entry from './Entry';
import Spacer from './Spacer';

interface Props extends AppProps {
  className?: string;
}

function renderEntry (route: Route): React.ReactNode {
  return (
    <Entry
      key={route.name}
      route={route}
    />
  );
}

// NOTE: This _looks_ weird, because it is weird. Basically we want all the entries
// of an equal width. So here we add a non-content spacers at the end that just
// ensures flex has enough items to render something usable to the user. Since we don't
// quite know how many items per row, we just render a bunch, n === routes.length
function renderSpacer (route: Route, index: number): React.ReactNode {
  return (
    <Spacer key={index} />
  );
}

function DashboardApp ({ className }: Props): React.ReactElement<Props> {
  const [routes] = useState(
    routing.routes.filter((route): boolean =>
      !!route && !route.display.isHidden && route.name !== 'dashboard'
    ) as Route[]
  );

  return (
    <main className={className}>
      <div className='routes'>
        {routes.map(renderEntry)}
        {routes.map(renderSpacer)}
      </div>
    </main>
  );
}

export default styled(DashboardApp)`
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
