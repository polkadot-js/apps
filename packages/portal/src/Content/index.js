// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './Content.css';

import React from 'react';
import { translate } from 'react-i18next';
import { Route } from 'react-router-dom';

import routes from '../routes';

type Props = BaseProps & {};

export default translate(['portal'])(
  function Content ({ className, style }: Props) {
    return (
      <div
        className={['portal--Content', className].join(' ')}
        style={style}
      >
        {
          routes.map(({ component, isExact, key, path }) => (
            <Route
              component={component}
              exact={isExact}
              key={key}
              path={path}
            />
          ))
        }
      </div>
    );
  }
);
