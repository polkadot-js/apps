// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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

type Props = I18nProps & {
  collapse: () => void,
  handleResize: () => void,
  isCollapsed: boolean,
  menuOpen: boolean,
  toggleMenu: () => void
};

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

class SideBar extends React.PureComponent<Props> {
  render () {
    const { isCollapsed } = this.props;

    return (
      <Responsive
        onUpdate={this.props.handleResize}
        className={
          classes(
            'apps-SideBar-Wrapper',
              isCollapsed ? 'collapsed' : 'expanded'
            )
        }
      >
        {this.renderMenuToggle()}
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
                  ? null
                  : <NodeInfo />
              }
            </div>
            {this.renderCollapse()}
          </Menu>
          {this.renderToggleBar()}
        </div>
      </Responsive>
    );
  }

  private renderCollapse () {
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

  private renderLogo () {
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

  private renderRoutes () {
    const { isCollapsed } = this.props;
    const { t } = this.props;

    return routing.routes.map((route, index) => (
      route
        ? (
          <Item
            isCollapsed={isCollapsed}
            key={route.name}
            route={route}
            onClick={this.props.handleResize}
            t={t}
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

  private renderGithub () {
    return (
      <Menu.Item className='apps--SideBar-Item'>
        <a
          className='apps--SideBar-Item-NavLink'
          href='https://github.com/polkadot-js/apps'
          target='_blank'
        >
          <Icon name='github' /><span className='text'>GitHub</span>
        </a>
      </Menu.Item>
    );
  }

  private renderToggleBar () {
    return (
      <Responsive minWidth={SIDEBAR_MENU_THRESHOLD}>
        <div
          className='apps--SideBar-toggle'
          onClick={this.props.collapse}
        >
        </div>
      </Responsive>
    );
  }

  private renderMenuToggle () {
    const logo = getLogo(true);
    const { toggleMenu, menuOpen } = this.props;

    return (
      <Toggle
        alt='logo'
        className={menuOpen ? 'closed' : 'open delayed'}
        onClick={toggleMenu}
        src={logo}
      />
    );
  }

  private renderWiki () {
    return (
      <Menu.Item className='apps--SideBar-Item'>
        <a
          className='apps--SideBar-Item-NavLink'
          href='https://wiki.polkadot.network'
          target='_blank'
        >
          <Icon name='book' /><span className='text'>Wiki</span>
        </a>
      </Menu.Item>
    );
  }
}

export default translate(SideBar);
