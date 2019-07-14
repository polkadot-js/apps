// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import Icon from './Icon';
import { classes } from './util';

export type InsetProps = RouteComponentProps & {
  className?: string,
  children?: React.ReactNode
  isCollapsible?: boolean,
  header?: React.ReactNode,
  href?: string | null,
  withTopMargin?: boolean,
  withBottomMargin?: boolean
};

type State = {
  isCollapsed: boolean
};

class Inset extends React.PureComponent<InsetProps, State> {
  public state: State = {
    isCollapsed: true
  };

  public render (): React.ReactNode {
    const { children, className, isCollapsible, header, href, withBottomMargin, withTopMargin } = this.props;
    const { isCollapsed } = this.state;

    if (!children) {
      return null;
    }

    return (
      <div
        className={
          classes(
            'ui--Inset',
            href && 'as-link',
            isCollapsible && 'collapsible',
            withBottomMargin && 'bottom-margin',
            withTopMargin && 'top-margin',
            className
          )
        }
      >
        {isCollapsible && (
          <div
            className='header'
            onClick={this.toggleCollapsed}
          >
            <h3>{header}</h3>
            <Icon
              className={classes(isCollapsed && 'collapsed')}
              name='angle up'
            />
          </div>
        )}
        <div
          className={classes('children', (isCollapsible && isCollapsed) && 'collapsed')}
          onClick={href ? this.onClick : undefined}
        >
          {children}
        </div>
      </div>
    );
  }

  private onClick = () => {
    const { history, href } = this.props;

    history.push(href!);
  }

  private toggleCollapsed = () => {
    this.setState(({ isCollapsed }: State) => {
      return {
        isCollapsed: !isCollapsed
      };
    });
  }
}

export default withRouter(
  styled(Inset as React.ComponentClass<InsetProps, State>)`
    & {
      box-shadow: 0 3px 3px rgba(0,0,0,.2);
      position: relative;
      background: #fefefe;
      padding: 1rem;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;

      &.bottom-margin {
        margin-bottom: 2rem;
      }

      &.top-margin {
        margin-top: 2rem;
      }

      .header {
        cursor: pointer;
        height: 2rem;
        width: 100%;

        h3 {
          line-height: 2rem;
          margin-bottom: 0;
        }

        .icon {
          height: 4rem;
          width: 4rem;
          font-size: 2rem;
          color: rgba(0,0,0,0.35);
          position: absolute;
          right: 0;
          top: 0;
          line-height: 4rem;
          transition: all 0.2s;
          transform-origin: center center;

          &.collapsed {
            transform: rotate(180deg);
          }
        }
      }

      .children {
        &.collapsed {
          display: none;
        }
      }

      &.as-link {
        cursor: pointer;

        &:hover {
          box-shadow: 0 5px 5px rgba(0,0,0,.2);
          transform: translateY(-2px);
        }
      }
    }
  `
);
