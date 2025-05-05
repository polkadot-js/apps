// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Group } from './types.js';

import React from 'react';

import { Icon, styled } from '@polkadot/react-components';

import Item from './Item.js';

interface Props extends Group {
  className?: string;
  isActive: boolean;
}

const SHA_COL = 'rgba(34, 36, 38, 0.12)';
const SHA_OFF = '5px';

function Grouping ({ className = '', isActive, name, routes }: Props): React.ReactElement<Props> {
  if (routes.length === 1 && routes[0].group === 'settings') {
    return (
      <Item
        className={isActive ? 'isActive' : ''}
        classNameText='smallHide'
        isToplevel
        route={routes[0]}
      />
    );
  }

  return (
    <StyledLi className={`${className} ${isActive ? 'isActive' : ''}`}>
      <div className={`groupHdr ${!isActive ? 'highlight--color-contrast' : ''}`}>
        <span className='smallHide'>{name}</span>
        <Icon
          className='smallShow'
          icon={routes[0].icon}
        />
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
    </StyledLi>
  );
}

const StyledLi = styled.li`
  cursor: pointer;
  position: relative;

  .groupHdr {
    border-radius: 0.25rem;
    padding: 0.857rem 1.375rem;
    font-weight: var(--font-weight-normal);
    line-height: 1.214rem;

    > .ui--Icon {
      margin-left: 0.75rem;
    }
  }

  &.isActive .groupHdr {
    background-color: var(--bg-tabs);
    font-weight: var(--font-weight-normal);
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
`;

export default React.memo(Grouping);
