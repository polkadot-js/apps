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

const SHA_COL = 'rgba(34, 36, 38, 0.12)';
const SHA_OFF = '5px';

function Grouping ({ className = '', name, routes }: Props): React.ReactElement<Props> {
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
    padding: 1rem 1.25rem 1rem 1.5rem;

    > .ui--Icon {
      margin-left: 0.75rem;
    }
  }

  .groupMenu {
    border-radius: 0 0 0.25rem 0.25rem;
    box-shadow: 0 ${SHA_OFF} ${SHA_OFF} -${SHA_OFF} , ${SHA_OFF} 0 ${SHA_OFF} -${SHA_OFF} ${SHA_COL}, -${SHA_OFF} 0 ${SHA_OFF} -${SHA_OFF} ${SHA_COL};
    display: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    z-index: 250;

    > li {
      z-index: 1;

      a {
        padding-right: 4rem;
      }
    }
  }

  &:hover {
    .groupHdr,
    .groupMenu li {
      background: rgba(254, 252, 250, 0.95);
    }

    .groupHdr {
      box-shadow: 0 -${SHA_OFF} ${SHA_OFF} -${SHA_OFF} ${SHA_COL}, ${SHA_OFF} 0 ${SHA_OFF} -${SHA_OFF} ${SHA_COL}, -${SHA_OFF} 0 ${SHA_OFF} -${SHA_OFF} ${SHA_COL};
    }

    .groupMenu {
      display: block;

      > li:hover {
        background: transparent;
      }
    }
  }
`);
