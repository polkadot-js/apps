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
      <div>
        <span>{name}</span>
        <Icon icon='caret-down' />
      </div>
      <ul className='dropdown'>
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

  > div {
    border-radius: 0.25rem 0.25rem 0 0;
    padding: 1rem 1.5rem;

    > .ui--Icon {
      margin-left: 0.75rem;
    }
  }

  ul.dropdown {
    background: #4f5255;
    border-radius: 0 0 0.25rem 0.25rem;
    display: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    z-index: 250;

    > li {
      padding-right: 3.5rem;
    }
  }

  &:hover {
    > div,
    > ul li {
      background: rgba(245, 244, 243, 0.125);
    }

    > ul {
      display: block;

      > li:hover {
        background: rgba(245, 244, 243, 0.2);
      }
    }
  }
`);
