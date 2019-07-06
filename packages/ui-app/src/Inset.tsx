// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { classes } from './util';

type Props = RouteComponentProps & {
  className?: string,
  href?: string | null,
  children?: React.ReactNode
};

class ProposedAction extends React.PureComponent<Props> {
  render () {
    const { children, className, href } = this.props;

    if (!children) {
      return null;
    }

    return (
      <div
        className={classes('ui--Inset', href && 'as-link', className)}
        onClick={href ? this.onClick : undefined}
      >
        {children}
      </div>
    );
  }

  private onClick = () => {
    const { history, href } = this.props;

    history.push(href!);
  }
}

export default withRouter(
  styled(ProposedAction as React.ComponentClass<Props>)`
    & {
      box-shadow: 0 3px 3px rgba(0,0,0,.2);
      position: relative;
      background: #fefefe;
      padding: 1rem;
      transition: all 0.2s;

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
