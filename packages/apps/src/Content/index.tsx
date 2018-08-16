// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { Route } from '../types';

import './Content.css';

import React from 'react';
import { withRouter } from 'react-router';

import classes from '@polkadot/ui-app/util/classes';

import routing from '../routing';
import NotFound from './NotFound';

type Props = I18nProps & {
  location: Location
};

const unknown = {
  Component: NotFound
};

class Content extends React.PureComponent<Props> {
  render () {
    const { className, location, style } = this.props;

    const app = location.pathname.slice(1);
    const { Component } = routing.routes.find((route: Route | null) =>
      !!(route && route.name === app)
    ) || unknown;

    return (
      <div
        className={classes('apps--Content', className)}
        style={style}
      >
        <Component />
      </div>
    );
  }
}

// @ts-ignore Ok, here the definition doesn't like this one... at all :(
export default withRouter(Content);
