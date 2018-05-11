// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Location } from 'react-router-dom';
import type { I18nProps } from '@polkadot/ui-app/types';

import './Content.css';

import React from 'react';
import { withRouter } from 'react-router';

import routing from '../routing';
import translate from '../translate';

type Props = I18nProps & {
  location: Location
};

function Content ({ className, location, style }: Props): React$Node {
  const app = location.pathname.slice(1) || routing.default;

  return (
    <div
      className={['apps--Content', className].join(' ')}
      style={style}
    >
      <iframe
        className='apps--Content-Frame'
        src={`index.html?app=${app}`}
        title={app}
      />
    </div>
  );
}
export default translate(
  withRouter(Content)
);
