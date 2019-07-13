// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from '@polkadot/apps-routing/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { SIDEBAR_MENU_THRESHOLD } from '../constants';

import './SideBar.css';

import React from 'react';
import styled from 'styled-components';
import { Responsive } from 'semantic-ui-react';
import routing from '@polkadot/apps-routing';
import { Button, Icon, Menu, media } from '@polkadot/ui-app';
import { classes } from '@polkadot/ui-app/util';
import { logoBackground, logoPadding } from '@polkadot/ui-app/styles/theme';

import translate from '../translate';
import Item from './Item';
import NodeInfo from './NodeInfo';
import getLogo from './logos';

interface Props extends I18nProps {
  collapse: () => void;
  handleResize: () => void;
  isCollapsed: boolean;
  menuOpen: boolean;
  toggleMenu: () => void;
}

interface State {
  modals: Record<string, boolean>;
}

const Toggle = styled.img`
  background: ${logoBackground};
  padding: ${logoPadding};
  border-radius: 50%;
  cursor: pointer;
  left: 0.9rem;
  opacity: 0;
  position: absolute;
  top: 0px;
  transition: opacity 0.2s ease-in, top 0.2s ease-in;
  width: 2.8rem;

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
`;

class SideBar extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    // setup modals for each of the actual modal routes
    this.state = {
      modals: routing.routes.reduce((result, route): Record<string, boolean> => {
        if (route && route.Modal) {
          result[route.name] = false;
        }

        return result;
      }, {} as unknown as Record<string, boolean>)
    };
  }

  public render (): React.ReactNode {
    const { handleResize, isCollapsed, toggleMenu, menuOpen } = this.props;
    const logo = getLogo(true);

    return (
      <Responsive
        onUpdate={handleResize}
        className={classes('apps-SideBar-Wrapper', isCollapsed ? 'collapsed' : 'expanded')}
      >
        <Toggle
          alt='logo'
          className={menuOpen ? 'closed' : 'open delayed'}
          onClick={toggleMenu}
          src={logo}
        />
        {this.renderModals()}
        <div className='apps--SideBar'>
          <Menu
            secondary
            vertical
          >
            <div className='apps-SideBar-Scroll'>
              {this.renderLogo()}
              {this.renderRoutes()}
              <Menu.Divider hidden />
              {this.renderGithub()}
              {this.renderWiki()}
              <Menu.Divider hidden />
              {
                isCollapsed
                  ? undefined
                  : <NodeInfo />
              }
            </div>
            {this.renderCollapse()}
          </Menu>
          <Responsive minWidth={SIDEBAR_MENU_THRESHOLD}>
            <div
              className='apps--SideBar-toggle'
              onClick={this.props.collapse}
            />
          </Responsive>
        </div>
      </Responsive>
    );
  }

  private renderCollapse (): React.ReactNode {
    const { isCollapsed } = this.props;

    return (
      <Responsive
        minWidth={SIDEBAR_MENU_THRESHOLD}
        className={`apps--SideBar-collapse ${isCollapsed ? 'collapsed' : 'expanded'}`}
      >
        <Button
          icon={`angle double ${isCollapsed ? 'right' : 'left'}`}
          isBasic
          isCircular
          onClick={this.props.collapse}
        />
      </Responsive>
    );
  }

  private renderLogo (): React.ReactNode {
    const { isCollapsed } = this.props;
    const logo = getLogo(isCollapsed);

    return (
      <img
        alt='polkadot'
        className='apps--SideBar-logo'
        src={logo}
      />
    );
  }

  private renderModals (): React.ReactNode {
    const { modals } = this.state;
    const filtered = routing.routes.filter((route): any => route && route.Modal) as Route[];

    return filtered.map(({ name, Modal }): React.ReactNode => (
      Modal && modals[name]
        ? (
          <Modal
            key={name}
            onClose={this.closeModal(name)}
          />
        )
        : <div key={name} />
    ));
  }

  private renderRoutes (): React.ReactNode {
    const { handleResize, isCollapsed } = this.props;

    return routing.routes.map((route, index): React.ReactNode => (
      route
        ? (
          <Item
            isCollapsed={isCollapsed}
            key={route.name}
            route={route}
            onClick={
              route.Modal
                ? this.openModal(route.name)
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
    ));
  }

  private renderGithub (): React.ReactNode {
    return (
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
    );
  }

  private renderWiki (): React.ReactNode {
    return (
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
    );
  }

  private closeModal = (name: string): () => void => {
    return (): void => {
      this.setState(({ modals }): State => ({
        modals: {
          ...modals,
          [name]: false
        }
      }));
    };
  }

  private openModal = (name: string): () => void => {
    return (): void => {
      this.setState(({ modals }): State => ({
        modals: {
          ...modals,
          [name]: true
        }
      }));
    };
  }
}

export default translate(SideBar);
