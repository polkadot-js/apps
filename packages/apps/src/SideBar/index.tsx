// Copyright 2017-2020 @canvas-ui/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Routes } from '@canvas-ui/apps-routing/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Responsive } from 'semantic-ui-react';
import createRoutes from '@canvas-ui/apps-routing';
import { Menu, media } from '@canvas-ui/react-components';

import { useTranslation } from '../translate';
import Item from './Item';
import Settings from './Settings';

interface Props {
  className?: string;
  collapse: () => void;
  handleResize: () => void;
  isCollapsed: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

function SideBar ({ className = '', handleResize, isCollapsed }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const routing = useMemo<Routes>(
    () => createRoutes(t),
    [t]
  );

  return (
    <Responsive
      className={`apps--SideBar-Wrapper ${className} ${isCollapsed ? 'collapsed' : 'expanded'}`}
      onUpdate={handleResize}
    >
      <div className='apps--SideBar'>
        <Menu
          secondary
          vertical
        >
          <div className='apps--SideBar-Scroll'>
            {routing.map((route, index): React.ReactNode => (
              route
                ? (
                  <Item
                    isCollapsed={isCollapsed}
                    key={route.name}
                    onClick={handleResize}
                    route={route}
                  />
                )
                : (
                  <Menu.Divider
                    hidden
                    key={index}
                  />
                )
            ))}
          </div>
        </Menu>
        <Settings />
      </div>
    </Responsive>
  );
}

const sideBorderWidth = '0.65rem';

export default React.memo(styled(SideBar)`
  display: flex;
  min-width: 14.25rem;
  position: relative;
  z-index: 300;

  .apps--SideBar {
    align-items: center;
    background: var(--grey20);
    box-sizing: border-box;
    display: flex;
    flex-flow: column;
    height: auto;
    position: relative;
    transition: left 0.3s linear;
    width: 100%;

    .apps--SideBar-border {
      border-top: ${sideBorderWidth} solid transparent;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
    }

    .ui.vertical.menu {
      display: flex;
      height: 100vh;
      margin: 0;
      top: 0;
      width: 100%;
      position: sticky;
    }

    .apps--SideBar-Scroll {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow-y: auto;
      width: 100%;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
        width: 0px;
      }
    }

    .apps--SideBar-Item {
      align-self: flex-end;
      flex-grow: 0;
      font-size: 1rem;
      padding: 0 !important;
      position: relative;
      width: inherit;

      &:not(:last-child) {
        margin-bottom: 0.75rem;
      }

      .ui--Badge {
        margin: 0;
        position: absolute;
        right: 0.5rem;
        top: 0.55rem;
        z-index: 1;
      }

      i.icon {
        margin-right: 0;
      }
    }

    .apps--SideBar-collapse {
      bottom: 0;
      left: 0;
      padding: 0.75rem 0 .75rem 0.65rem;
      position: sticky;
      right: 0;
      text-align: left;
      width: 100%;

      .ui.circular.button {
        background: white !important;
        color: #3f3f3f !important;
        box-shadow: 0 0 0 1px #eee inset !important;
        margin: 0;
        transition: transform 0.15s;
      }
    }

    .apps--SideBar-toggle {
      height: 100%;
      position: absolute;
      right: 0px;
      top: 0px;
      transition: all 0.2s;
      width: 6px;

      &:hover {
        background: rgba(255,255,255,0.15);
        cursor: pointer;
      }
    }
  }

  .toggleImg {
    cursor: pointer;
    height: 2.75rem;
    left: 0.9rem;
    opacity: 0;
    position: absolute;
    top: 0px;
    transition: opacity 0.2s ease-in, top 0.2s ease-in;
    width: 2.75rem;

    &.delayed {
      transition-delay: 0.4s;
    }

    &.open {
      opacity: 1;
      top: 0.9rem;
    }

    ${media.DESKTOP`
      opacity: 0 !important;
      top: -2.9rem !important;
    `}
  }
`);
