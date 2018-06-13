// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Location } from 'react-router-dom';
import type { I18nProps } from '@polkadot/ui-app/types';

import './Content.css';

import React from 'react';
import { withRouter } from 'react-router';

import classes from '@polkadot/ui-app/util/classes';

import routing from '../routing';

type Props = I18nProps & {
  location: Location
};

function Content ({ children, className, location, style }: Props): React$Node {
  const app = location.pathname.slice(1) || routing.default;
  const { Component } = routing.routes.find((route) =>
    route && route.name === app
  ) || routing.unknown;

  return (
    <div
      className={classes('apps--Content', className)}
      style={style}
    >
      <Component />
    </div>
  );
}

export default withRouter(Content);
