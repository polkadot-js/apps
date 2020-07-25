// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '@polkadot/apps-routing/types';

import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import createRoutes from '@polkadot/apps-routing';
import { Button, ChainImg, Icon, Menu, media } from '@polkadot/react-components';

import { SIDEBAR_MENU_THRESHOLD } from '../constants';
import NetworkModal from '../modals/Network';
import { useTranslation } from '../translate';
import ChainInfo from './ChainInfo';
import Item from './Item';
import NodeInfo from './NodeInfo';

interface Props {
  className?: string;
  collapse: () => void;
  handleResize: () => void;
  isCollapsed: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

function SideBar ({ className = '', collapse, handleResize, isCollapsed, isMenuOpen, toggleMenu }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [modals, setModals] = useState<Record<string, boolean>>(
    createRoutes(t).reduce((result: Record<string, boolean>, route): Record<string, boolean> => {
      if (route && route.Modal) {
        result[route.name] = false;
      }

      return result;
    }, { network: false })
  );

  const routing = useMemo<Routes>(
    () => createRoutes(t),
    [t]
  );

  const _toggleModal = useCallback(
    (name: string): () => void =>
      (): void => setModals((modals: Record<string, boolean>) => ({
        ...modals,
        [name]: !modals[name]
      })),
    []
  );

  return (
    <div className={`apps--SideBar-Wrapper ${className} ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <ChainImg
        className={`toggleImg ${isMenuOpen ? 'closed' : 'open delayed'}`}
        onClick={toggleMenu}
      />
      {routing.map((route): React.ReactNode => (
        route?.Modal
          ? route.Modal && modals[route.name]
            ? (
              <route.Modal
                key={route.name}
                onClose={_toggleModal(route.name)}
              />
            )
            : <div key={route.name} />
          : null
      ))}
      {modals.network && (
        <NetworkModal onClose={_toggleModal('network')}/>
      )}
      <div className='apps--SideBar'>
        <Menu
          secondary
          vertical
        >
          <div className='apps--SideBar-Scroll'>
            <ChainInfo onClick={_toggleModal('network')} />
            {routing.map((route, index): React.ReactNode => (
              route
                ? (
                  <Item
                    isCollapsed={isCollapsed}
                    key={route.name}
                    onClick={
                      route.Modal
                        ? _toggleModal(route.name)
                        : handleResize
                    }
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
            <Menu.Divider hidden />
            <Menu.Item className='apps--SideBar-Item'>
              <a
                className='apps--SideBar-Item-NavLink'
                href='https://github.com/polkadot-js/apps'
                rel='noopener noreferrer'
                target='_blank'
              >
                <Icon icon='code-branch' /><span className='text'>{t<string>('nav.github', 'GitHub', { ns: 'apps-routing' })}</span>
              </a>
            </Menu.Item>
            <Menu.Item className='apps--SideBar-Item'>
              <a
                className='apps--SideBar-Item-NavLink'
                href='https://wiki.polkadot.network'
                rel='noopener noreferrer'
                target='_blank'
              >
                <Icon icon='book' /><span className='text'>{t<string>('nav.wiki', 'Wiki', { ns: 'apps-routing' })}</span>
              </a>
            </Menu.Item>
            <Menu.Divider hidden />
            {!isCollapsed && <NodeInfo />}
          </div>
          <div className={`apps--SideBar-collapse ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            <Button
              icon={isCollapsed ? 'angle-double-right' : 'angle-double-left'}
              isBasic
              isCircular
              onClick={collapse}
            />
          </div>
        </Menu>
        <div
          className='apps--SideBar-toggle'
          onClick={collapse}
        />
      </div>
    </div>
  );
}

const sideBorderWidth = '0.65rem';

export default React.memo(styled(SideBar)`
  display: flex;
  position: relative;
  z-index: 300;

  &.collapsed {
    width: 4.2rem;
  }

  &.expanded {
    width: 12rem;
  }

  .apps--SideBar {
    align-items: center;
    background: #4f5255;
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
      padding: 0 !important;
      position: relative;
      width: inherit;

      .text {
        padding-left: 0.5rem;
      }

      .ui--Badge {
        margin: 0;
        position: absolute;
        right: 0.5rem;
        top: 0.55rem;
        z-index: 1;
      }
    }

    .apps--SideBar-collapse {
      background: #4f5255;
      bottom: 0;
      left: 0;
      padding: 0.75rem 0 .75rem 0.65rem;
      position: sticky;
      right: 0;
      text-align: left;
      width: 100%;
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

  @media only screen and (max-width: ${SIDEBAR_MENU_THRESHOLD}px) {
    .apps--SideBar-collapse,
    .apps--Sidebar-toggle {
      display: none;
    }
  }
`);
