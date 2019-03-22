// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

type Props = BareProps & {
  children?: React.ReactNode
};

export default class SummaryBox extends React.PureComponent<Props> {
  render () {
    return (
      <div className='ui--summary'>
        {this.props.children}
      </div>
    );
  }
}
