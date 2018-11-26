// Copyright 2017-2018 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps } from './types';

import './Scan.css';

import React from 'react';
import Reader from 'react-qr-reader';

import { createSize } from './constants';

type Props = BaseProps & {
  delay?: number,
  onError?: (error: Error) => void,
  onScan?: (data: string) => void,
  size?: number
};

const DEFAULT_DELAY = 150;
const DEFAULT_ERROR = (error: Error) => {
  console.error('@polkadot/ui-qr:Scan', error);
};

export default class Scan extends React.PureComponent<Props> {
  render () {
    const { className, delay = DEFAULT_DELAY, size, style } = this.props;

    return (
      <div style={createSize(size)}>
        <Reader
          className={`ui--qr-Scan ${className}`}
          delay={delay}
          onError={this.handleError}
          onScan={this.handleScan}
          style={style}
        />
      </div>
    );
  }

  private handleError = (error: Error) => {
    const { onError = DEFAULT_ERROR } = this.props;

    onError(error);
  }

  private handleScan = (data: string | null) => {
    const { onScan } = this.props;

    if (!data || !onScan) {
      return;
    }

    onScan(data);
  }
}
