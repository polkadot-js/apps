// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, InputErrorMessage } from './types';

import React from 'react';

import Message from 'semantic-ui-react/dist/commonjs/collections/Message/index';

import InputError from './InputError';

type SemanticMessageSizes = 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive';

type Props = BareProps & {
  error?: InputErrorMessage,
  // Issue: https://github.com/Semantic-Org/Semantic-UI-React/issues/3071
  size?: SemanticMessageSizes
};

export default class Notification extends React.PureComponent<Props> {
  render () {
    const { error, size = 'tiny' } = this.props;

    if (!error) {
      return null;
    }

    return (
      <div className='ui--Notifications'>
        <Message size={size} error>
          <InputError error={error} />
        </Message>
      </div>
    );
  }
}
