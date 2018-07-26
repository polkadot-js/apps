// Copyright 2017-2018 @polkadot/app-telemetry authors & contributors
// This software may be modified and distributed under the terms
// of the GPL-3.0 license. See the LICENSE file for details

import './index.css';
// import { unregister } from './registerServiceWorker';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';

import App from './App';

export default class TelemetryApp extends React.PureComponent<any> {
  render () {
    const { className, style } = this.props;

    return (
      <div
        className={classes('telemetry--App', className)}
        style={style}
      >
        <App />
      </div>
    );
  }
}

// unregister();
