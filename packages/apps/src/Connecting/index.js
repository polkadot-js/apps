// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';
import type { ApiProps } from '@polkadot/ui-react-rx/types';

import './Connecting.css';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';
import withApi from '@polkadot/ui-react-rx/with/api';

import translate from '../translate';

type Props = I18nProps & ApiProps;

function Connecting ({ apiConnected, className, style, t }: Props): React$Node {
  if (apiConnected) {
    return null;
  }

  return (
    <div
      className={classes('apps--Connecting', className)}
      style={style}
    >
      <div className='apps--Connecting-text'>
        {t('connecting.disconnected', {
          defaultValue: 'You are not connected to a node. Ensure that your node is running and that the Websocket endpoint is reachable.'
        })}
      </div>
    </div>
  );
}

export default translate(
  withApi(Connecting)
);
