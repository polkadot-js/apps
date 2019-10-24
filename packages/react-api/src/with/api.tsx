// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps, SubtractProps } from '../types';
import { DefaultProps } from './types';

import React, { useContext } from 'react';

import ApiContext from '../ApiContext';

export default function withApi <P extends ApiProps, S = SubtractProps<P, ApiProps>> (Inner: React.ComponentType<P>, defaultProps: DefaultProps = {}): React.ComponentType<S> {
  return function WithApi (props: S): React.ReactElement<S> {
    // Something is weird with the inner assignment... when this is in, we have an issue
    const apiProps = useContext(ApiContext) as any;

    return (
      <Inner
        {...defaultProps}
        {...apiProps}
        {...props}
      />
    );
  };
}
