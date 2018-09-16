// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message/index';

type SemanticMessageSizes = 'mini' | 'tiny' | 'small' | 'large' | 'big' | 'huge' | 'massive';

type Props = BareProps & {
  error?: React.ReactNode,
  formError?: React.ReactNode,
  // Issue: https://github.com/Semantic-Org/Semantic-UI-React/issues/3071
  size?: SemanticMessageSizes,
  success?: React.ReactNode
};

export default class Notification extends React.PureComponent<Props> {
  render () {
    const { error, formError, size = 'tiny', success } = this.props;
    const isError: boolean = !!error || !!formError;
    const isSuccess: boolean = !isError && !!success;

    if (!isError && !isSuccess) {
      return null;
    }

    return (
      <div className='ui--Notifications'>
        <Message
          error={isError}
          size={size}
          success={isSuccess}
        >
          {error || formError}
          {!isError && isSuccess ? success : null}
        </Message>
      </div>
    );
  }
}
