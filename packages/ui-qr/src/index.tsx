// Copyright 2017-2018 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the APL2 license. See the LICENSE file for details.

import { BaseProps } from './types';

import React from 'react';

import Display from './Display';
import Scan from './Scan';

type Props = BaseProps & {
  isScanning: boolean
  onScan: (data: any) => void,
  size?: number
};

const DEFAULT_SIZE = 300;

export default class Qr extends React.PureComponent<Props> {
  render () {
    const { isScanning, size = DEFAULT_SIZE } = this.props;
    const height = `${size}px`;

    return (
      <div style={{
        height,
        width: height
      }}>{
        isScanning
          ? this.renderScan()
          : this.renderDisplay()
      }</div>
    );
  }

  private renderDisplay () {
    const { className } = this.props;
    const value = {};

    return (
      <Display
        className={className}
        value={JSON.stringify(value)}
      />
    );
  }

  private renderScan () {
    const { className } = this.props;

    return (
      <Scan
        className={className}
        onScan={this.handleScan}
      />
    );
  }

  private handleScan = (data: string | null) => {
    if (!data) {
      return;
    }
  }
}
