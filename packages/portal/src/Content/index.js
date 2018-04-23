// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseContext, BaseProps } from '../types';

import './Content.css';

import PropTypes from 'prop-types';
import React from 'react';
import { translate } from 'react-i18next';

import routing from '../routing';

type Props = BaseProps & {};

function Content ({ className, style }: Props, { router: { route: { location } } }: BaseContext) {
  const app = location.pathname.slice(1) || routing.default;

  return (
    <div
      className={['portal--Content', className].join(' ')}
      style={style}
    >
      <iframe
        className='portal--Content-Frame'
        src={`index.html?app=${app}`}
        title={app}
      />
    </div>
  );
}

Content.contextTypes = {
  router: PropTypes.object
};

export default translate(['portal'])(Content);
