// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SIDEBAR_MENU_THRESHOLD } from '../constants';

import './SideBar.css';

import React from 'react';
import { Button, Icon, Menu } from '@polkadot/ui-app';
import { classes } from '@polkadot/ui-app/util';

import routing from '../routing';
import translate from '../translate';
import Item from './Item';
import NodeInfo from './NodeInfo';
import getLogo from './logos';

import { Responsive } from 'semantic-ui-react';

type Props = I18nProps & {
  collapse: () => void,
  handleResize: () => void,
  isCollapsed: boolean,
  menuOpen: boolean,
  toggleMenu: () => void
};

class SideBar extends React.PureComponent<Props> {
  render () {
    const { isCollapsed } = this.props;

    return (
      <Responsive
        onUpdate={this.props.handleResize}
        className={
          classes('apps-SideBar-Wrapper',
                  isCollapsed ? 'collapsed' : 'expanded')
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
        className='apps--SideBar-collapse'
      >
        <Button
          icon='angle double right'
          isBasic
          isCircular
          onClick={this.props.collapse}
          className={isCollapsed ? '' : 'rotated'}
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
      <img
        alt='logo'
        className={menuOpen ? 'closed' : 'open delayed'}
        onClick={toggleMenu}
        src={logo}
      />
    );
  }

  private renderWiki () {
    return null;

    // disabled for now, we need the space
    // return (
    //   <Menu.Item className='apps--SideBar-Item'>
    //     <a
    //       className='apps--SideBar-Item-NavLink'
    //       href='https://github.com/w3f/Web3-wiki/wiki/Polkadot'
    //     >
    //       <Icon name='book' /> Wiki
    //     </a>
    //   </Menu.Item>
    // );
  }
}

export default translate(SideBar);
