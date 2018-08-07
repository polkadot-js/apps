// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, UnlockI18n } from './types';

import React from 'react';

import Message from 'semantic-ui-react/dist/commonjs/collections/Message/index';
import { SemanticSIZES } from 'semantic-ui-react/dist/commonjs/index';

type Props = BareProps & {
  error?: UnlockI18n | null,
  // FIXME - Temporary hack (without `| 'medium'`) until PR accepted by semantic-ui-react. After PR resolved
  // then replace with just `size?: SemanticSIZES`
  // Issue: https://github.com/Semantic-Org/Semantic-UI-React/issues/3071
  // PR: https://github.com/Semantic-Org/Semantic-UI-React/pull/3072
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive'
};

export default class Notification extends React.PureComponent<Props> {
  render () {
    const { error, size = 'tiny' } = this.props;

    if (!error) {
      return null;
    }

    const renderMessageBody = (error: UnlockI18n) => {
      return (
        <div>
          {/* <Message.Header>{error.key}</Message.Header> */}
          <p>{error.key}: <b>{error.value}</b></p>
        </div>
      );
    };

    return (
      <div className='ui--Notifications'>
        { error.key === 'error' ? <Message size={size} error>{ renderMessageBody(error) }</Message> : null }
        { error.key === 'warning' ? <Message size={size} negative>{ renderMessageBody(error) }</Message> : null }
      </div>
    );
  }
}
