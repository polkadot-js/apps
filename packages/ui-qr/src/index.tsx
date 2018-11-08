// Copyright 2017-2018 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the APL2 license. See the LICENSE file for details.

import { BaseProps } from './types';

import React from 'react';

import QrCode from './QrCode';
import QrScan from './QrScan';

type Props = BaseProps & {
  isScanning: boolean
  onScan: (data: any) => void,
  size?: number
};

type Style = {
  height: string,
  width: string
};

const DEFAULT_SIZE = 300;

export default class QrSigner extends React.PureComponent<Props> {
  render () {
    const { isScanning, size = DEFAULT_SIZE } = this.props;

    const style = {
      width: `${size}px`,
      height: `${size}px`
    };

    return isScanning
      ? this.renderScanner(style)
      : this.renderReader(style);
  }

  private renderScanner (style: Style) {
    const { className } = this.props;

    return (
      <div style={style}>
        <QrScan
          className={className}
          onScan={this.handleScan}
        />
      </div>
    );
  }

  private renderReader (style: Style) {
    const { className } = this.props;
    const value = {};

    return (
      <div style={style}>
        <QrCode
          className={className}
          value={JSON.stringify(value)}
        />
      </div>
    );
  }

  private handleScan = (data: string | null) => {
    if (!data) {
      return;
    }
  }
}
