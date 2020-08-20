// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Group } from './types';

import React from 'react';
import styled from 'styled-components';
import { Icon } from '@polkadot/react-components';

import Item from './Item';

interface Props extends Group {
  className?: string;
}

function Grouping ({ className, name, routes }: Props): React.ReactElement<Props> {
  if (routes.length === 1) {
    return (
      <Item
        className='topLevel'
        route={routes[0]}
      />
    );
  }

  return (
    <li className={className}>
      <div className='groupHdr'>
        <span>{name}</span>
        <Icon icon='caret-down' />
      </div>
      <ul className='groupMenu menuBg ui--highlight--before'>
        {routes.map((route): React.ReactNode => (
          <Item
            key={route.name}
            route={route}
          />
        ))}
      </ul>
    </li>
  );
}

export default React.memo(styled(Grouping)`
  cursor: pointer;
  position: relative;

  .groupHdr {
    border-radius: 0.25rem 0.25rem 0 0;
    padding: 1rem 1.5rem;

    > .ui--Icon {
      margin-left: 0.75rem;
    }
  }

  .groupMenu {
    border-radius: 0 0 0.25rem 0.25rem;
    display: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    z-index: 250;

    > li {
      z-index: 1;

      a {
        padding-right: 3.5rem;
      }
    }
  }

  &:hover {
    .groupHdr,
    .groupMenu li {
      background: rgba(245, 243, 241, 0.11);
    }

    .groupMenu {
      display: block;

      > li:hover {
        background: rgba(245, 243, 241, 0.22);
      }
    }
  }
`);
