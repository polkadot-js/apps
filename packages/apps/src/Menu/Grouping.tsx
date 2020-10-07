// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ThemeProps } from '@polkadot/react-components/types';
import { Group } from './types';

import React from 'react';
import styled from 'styled-components';

import Item from './Item';
import { Icon } from '@polkadot/react-components';
import { Route } from '@polkadot/apps-routing/types';

interface Props extends Group {
  className?: string;
  variant?: string;
  activeRoute?: Route;
}

const SHA_COL = 'rgba(34, 36, 38, 0.12)';
const SHA_OFF = '5px';

function Grouping ({ activeRoute, className = '', name, routes, variant }: Props): React.ReactElement<Props> {
  if (routes && routes.length === 1) {
    switch (variant) {
      case 'active-tab': {
        return (
          <>{activeRoute &&
            <div className='active-tab highlight--color'>
              <Icon icon={activeRoute.icon} />
              <span>{activeRoute.text}</span>
            </div>}
          </>
        );
      }

      default: {
        return (
          <Item
            isToplevel
            route={routes[0]}
          />
        );
      }
    }
  }

  switch (variant) {
    case 'active-tab': {
      return (
        <li className={className}>
          {activeRoute && (
            <div className='active-tab highlight--color'>
              <Icon icon={activeRoute.icon} />
              <span>{activeRoute.text}</span>
              {routes && routes.length > 1 &&
                <Icon
                  className='dropdown'
                  icon={'caret-down'}
                />
              }
            </div>
          )}
          {routes && routes.length > 1 &&
            <ul className='groupMenu tab highlight--bg-light'>
              {routes.map((route): React.ReactNode => (
                <Item
                  className={(activeRoute && activeRoute.text === route.text) ? 'active highlight--color' : ''}
                  key={route.name}
                  route={route}
                />
              ))}
            </ul>
          }
        </li>
      );
    }

    default: {
      return (
        <li className={className}>
          <div className='groupHdr highlight--color-contrast'>
            <span>{name}</span>
          </div>
          <ul className='groupMenu highlight--bg-light'>
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
  }
}

export default React.memo(styled(Grouping)(({ theme }: ThemeProps) => `
  cursor: pointer;
  position: relative;

  &.ui--ActiveTab {
    list-style: none;
    display: flex;
    height: 100%;
    align-items: center;
  }

  .dropdown {
    transition: .3s;
    margin-left: .57rem;
  }

  .active-tab {
    margin: 0 2.5rem 0 1.7rem;
    font-weight: 600;
    font-size: 1.14rem;
    line-height: 1.57rem;
    min-width: max-content;

    .ui--Icon {
      margin-right: 0.85rem;
      max-width: 1rem;
      max-height: 1rem;
    }

    @media only screen and (max-width: 900px) {
      margin: 0 1.5rem;
    }
  }

  .groupHdr {
    position: relative;
    border-radius: 0.15rem 0.15rem 0 0;
    padding: 1rem .85rem 1rem .85rem;

    > .ui--Icon {
      margin-left: 0.75rem;
    }
  }

  .groupMenu {
    border-radius: 0.25rem;
    box-shadow: 0 ${SHA_OFF} ${SHA_OFF} -${SHA_OFF} ${SHA_COL}, ${SHA_OFF} 0 ${SHA_OFF} -${SHA_OFF} ${SHA_COL}, -${SHA_OFF} 0 ${SHA_OFF} -${SHA_OFF} ${SHA_COL};
    display: none;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    z-index: 250;
    left: 50%;
    transform: translate(-50%, 0);
    box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.06);

    > li:first-child {
        padding-top: .64rem;

        .ui--Badge {
          top: 55%;
        }
      }

    > li:last-child {
        padding-bottom: .64rem;

        .ui--Badge {
          top: 45%;
        }
      }

    > li {
      z-index: 1;

      a {
        padding-right: 4rem;

        .ui--Badge {
          top: 50%;
          right: .85rem;
          transform: translateY(-50%);
        }
      }
    }
  }

  .groupMenu.tab {
    left: 0;
    transform: translateY(95%);
    bottom: 0;
    transform-origin: bottom;

    li a {
      padding-left: 1.7rem;

      @media only screen and (max-width: 900px) {
        padding-left: 1.5rem;
      }
    }
  }

  &:hover {
    .groupMenu li {
      background: ${theme.bgMenu};
      color: ${theme.color};
      background: #fff;
    }

    .groupMenu li.active {
      background: ${theme.bgMenuHover};
    }

    .dropdown {
      transform: rotate(180deg);
    }

    .groupHdr::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      background: ${theme.bgMenu};
      width: 100%;
      height: 3.92rem;
      transform: translateY(.5rem);
      border-top-left-radius: .15rem;
      border-top-right-radius: .15rem;
      z-index: -1;
    }

    .groupHdr {
      box-shadow: 0 -${SHA_OFF} ${SHA_OFF} -${SHA_OFF} ${SHA_COL}, ${SHA_OFF} 0 ${SHA_OFF} -${SHA_OFF} ${SHA_COL}, -${SHA_OFF} 0 ${SHA_OFF} -${SHA_OFF} ${SHA_COL};
      color: ${theme.colorMenuHover};
    }

    .groupMenu {
      display: block;
      color: ${theme.colorMenuItem};

      > li:hover {
        background: ${theme.bgMenuHover};
      }
    }
  }
`));
