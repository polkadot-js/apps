// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import Message from 'semantic-ui-react/dist/commonjs/collections/Message/index';
import classes from './util/classes';

type SemanticMessageSizes = 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive';

type Props = BareProps & {
  error?: React.ReactNode,
  info?: React.ReactNode,
  // Issue: https://github.com/Semantic-Org/Semantic-UI-React/issues/3071
  size?: SemanticMessageSizes,
  warn?: React.ReactNode
};

export default class Notification extends React.PureComponent<Props> {
  render () {
    const { className, error, info, size = 'tiny', style, warn } = this.props;

    const isError: boolean = !!error;
    const isInfo: boolean = !isError && !!info;
    const isWarn: boolean = !isError && !!warn;

    if (!isError && !isInfo && !isWarn) {
      return null;
    }

    return (
      <div
        className={classes('ui--Notifications', className)}
        style={style}
      >
        <Message
          size={size}
          error={isError}
          info={isInfo}
          warning={isWarn}
        >
          {error}
          {!isError && !isWarn ? info : null}
          {!isError && !isInfo ? warn : null}
        </Message>
      </div>
    );
  }
}
