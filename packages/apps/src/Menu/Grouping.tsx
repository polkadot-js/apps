// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Group } from './types';

import React from 'react';
import styled from 'styled-components';

import { Icon } from '@polkadot/react-components';

import Item from './Item';

interface Props extends Group {
  className?: string;
  isActive: boolean;
}

const SHA_COL = 'rgba(34, 36, 38, 0.12)';
const SHA_OFF = '5px';

function Grouping ({ className = '', isActive, name, routes }: Props): React.ReactElement<Props> {
  if (routes.length === 1) {
    return (
      <Item
        className={isActive ? 'isActive' : ''}
        isToplevel
        route={routes[0]}
      />
    );
  }

  return (
    <li className={`${className} ${isActive ? 'isActive' : ''}`}>
      <div className={`groupHdr ${!isActive ? 'highlight--color-contrast' : ''}`}>
        <span>{name}</span>
        <Icon icon='caret-down' />
      </div>
      <ul className='groupMenu'>
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
    border-radius: 0.25rem;
    padding: 0.857rem 1.375rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.214rem;

    > .ui--Icon {
      margin-left: 0.75rem;
    }
  }

  &.isActive .groupHdr {
    background-color: var(--bg-tabs);
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 0;
  }

  .groupMenu {
    border-radius: 0.25rem;
    box-shadow: 0 ${SHA_OFF} ${SHA_OFF} -${SHA_OFF} ${SHA_COL}, ${SHA_OFF} 0 ${SHA_OFF} -${SHA_OFF} ${SHA_COL}, -${SHA_OFF} 0 ${SHA_OFF} -${SHA_OFF} ${SHA_COL};
    display: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    top: 2.9rem;
    z-index: 250;

    > li {
      z-index: 1;

      a {
        padding-right: 4rem;
      }
    }

    &::before {
      bottom: 0;
      content: ' ';
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      z-index: -1;
    }
  }

  &:hover {
    .groupHdr {
      box-shadow: 0px 4px 37px rgba(0, 0, 0, 0.08);
      padding-bottom: 2rem;
      margin-bottom: -2rem;
    }

    .groupMenu {
      display: block;

      > li:hover {
        background: var(--bg-menu-hover);
      }
    }
  }
`);
