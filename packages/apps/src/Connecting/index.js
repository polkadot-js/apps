// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './Connecting.css';

import React from 'react';
import withApiCall from '@polkadot/rx-react/with/apiCall';

import translate from '../translate';

type Props = BaseProps & {
  value: boolean
};

function Connecting ({ className, style, value, t }: Props): React$Node {
  if (value) {
    return null;
  }

  return (
    <div
      className={['portal--Connecting', 'ui inverted page modals dimmer transition visible active', className].join(' ')}
      style={style}
    >
      <div className='portal--Connecting-text'>
        {t('connecting.disconnected', {
          defaultValue: 'You are disconnected from the node. Check that your node is running and that the Websocket endpoint is reachable.'
        })}
      </div>
    </div>
  );
}

export default translate(
  withApiCall({
    method: 'isConnected'
  })(Connecting)
);
