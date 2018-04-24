// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './Connecting.css';

import PropTypes from 'prop-types';
import React from 'react';
import { translate } from 'react-i18next';
import withApiCall from '@polkadot/rx-react/with/apiCall';

type Props = BaseProps & {
  value: boolean
};

function Connecting ({ className, style, value, t }: Props, { api }: any) {
  if (value) {
    return null;
  }

  return (
    <div
      className={['portal--Connecting', 'ui inverted page modals dimmer transition visible active', className].join(' ')}
      style={style}
    >
      <div className='portal--Connecting-text'>
        {t('connecting.disconnected', { defaultValue: 'You are not connected to a Polkadot node via the API. Check that your node is running and the Websocket endpoints are reachable.' })}
      </div>
    </div>
  );
}

Connecting.contextTypes = {
  api: PropTypes.object
};

export default translate(['portal'])(
  withApiCall(Connecting, {
    method: 'isConnected'
  })
);
