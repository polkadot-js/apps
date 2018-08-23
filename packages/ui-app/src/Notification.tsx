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
  size?: SemanticMessageSizes
};

export default class Notification extends React.PureComponent<Props> {
  render () {
    const { className, error, info, size = 'tiny', style } = this.props;

    const isError = !!error;
    const isInfo = !isError && !!info;

    if (!isError && !isInfo) {
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
        >
          {error}
          {!isError ? info : null}
        </Message>
      </div>
    );
  }
}
