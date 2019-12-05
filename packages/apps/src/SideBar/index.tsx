// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RuntimeVersion } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { SIDEBAR_MENU_THRESHOLD } from '../constants';

import './SideBar.css';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Responsive } from 'semantic-ui-react';
import routing from '@polkadot/apps-routing';
import { Button, ChainImg, Icon, Menu, media } from '@polkadot/react-components';
import { useStream, useApi } from '@polkadot/react-hooks';
import { classes } from '@polkadot/react-components/util';
import { BestNumber, Chain } from '@polkadot/react-query';

import translate from '../translate';
import Item from './Item';
import NodeInfo from './NodeInfo';
import NetworkModal from '../modals/Network';

interface Props extends I18nProps {
  className?: string;
  collapse: () => void;
  handleResize: () => void;
  isCollapsed: boolean;
  menuOpen: boolean;
  toggleMenu: () => void;
}

function SideBar ({ className, collapse, handleResize, isCollapsed, toggleMenu, menuOpen }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const runtimeVersion = useStream<RuntimeVersion>(api.rpc.state.subscribeRuntimeVersion, []);
  const [modals, setModals] = useState<Record<string, boolean>>(
    routing.routes.reduce((result: Record<string, boolean>, route): Record<string, boolean> => {
      if (route && route.Modal) {
        result[route.name] = false;
      }

      return result;
    }, { network: false })
  );

  const _toggleModal = (name: string): () => void =>
    (): void => setModals({ ...modals, [name]: !modals[name] });

  return (
    <Responsive
      onUpdate={handleResize}
      className={classes(className, 'apps-SideBar-Wrapper', isCollapsed ? 'collapsed' : 'expanded')}
    >
      <ChainImg
        className={`toggleImg ${menuOpen ? 'closed' : 'open delayed'}`}
        onClick={toggleMenu}
      />
      {routing.routes.map((route): React.ReactNode => (
        route && route.Modal
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
          <div className='apps-SideBar-Scroll'>
            <div
              className='apps--SideBar-logo'
              onClick={_toggleModal('network')}
            >
              <ChainImg />
              <div className='info'>
                <Chain className='chain' />
                {runtimeVersion && (
                  <div className='runtimeVersion'>version {runtimeVersion.specVersion.toNumber()}</div>
                )}
                <BestNumber label='#' />
              </div>
            </div>
            {routing.routes.map((route, index): React.ReactNode => (
              route
                ? (
                  <Item
                    isCollapsed={isCollapsed}
                    key={route.name}
                    route={route}
                    onClick={
                      route.Modal
                        ? _toggleModal(route.name)
                        : handleResize
                    }
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
                <Icon name='github' /><span className='text'>GitHub</span>
              </a>
            </Menu.Item>
            <Menu.Item className='apps--SideBar-Item'>
              <a
                className='apps--SideBar-Item-NavLink'
                href='https://wiki.polkadot.network'
                rel='noopener noreferrer'
                target='_blank'
              >
                <Icon name='book' /><span className='text'>Wiki</span>
              </a>
            </Menu.Item>
            <Menu.Divider hidden />
            {
              isCollapsed
                ? undefined
                : <NodeInfo />
            }
          </div>
          <Responsive
            minWidth={SIDEBAR_MENU_THRESHOLD}
            className={`apps--SideBar-collapse ${isCollapsed ? 'collapsed' : 'expanded'}`}
          >
            <Button
              icon={`angle double ${isCollapsed ? 'right' : 'left'}`}
              isBasic
              isCircular
              onClick={collapse}
            />
          </Responsive>
        </Menu>
        <Responsive minWidth={SIDEBAR_MENU_THRESHOLD}>
          <div
            className='apps--SideBar-toggle'
            onClick={collapse}
          />
        </Responsive>
      </div>
    </Responsive>
  );
}

export default translate(
  styled(SideBar)`
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
  `
);
