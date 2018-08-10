// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import Message from 'semantic-ui-react/dist/commonjs/collections/Message/index';
import isUndefined from '@polkadot/util/is/undefined';

type SemanticMessageSizes = 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive';

type Props = BareProps & {
  error?: React.ReactNode,
  // Issue: https://github.com/Semantic-Org/Semantic-UI-React/issues/3071
  size?: SemanticMessageSizes
};

export default class Notification extends React.PureComponent<Props> {
  render () {
    const { error, size = 'tiny' } = this.props;
    console.log('error: ', error);
    if (!error) {
      return null;
    }

    return (
      <div className='ui--Notifications'>
        <Message size={size} error={!isUndefined(error)}>
          {error}
        </Message>
      </div>
    );
  }
}
