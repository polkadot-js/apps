// Copyright 2017-2018 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps } from './types';

import React from 'react';

import QrDisplay from './Display';
import QrScan from './Scan';

type Props = BaseProps & {
  isScanning: boolean
  onError?: (error: Error) => void,
  onScan?: (data: string) => void,
  size?: number,
  value?: { [index: string]: any }
};

export default class Qr extends React.PureComponent<Props> {
  render () {
    const { isScanning } = this.props;

    return isScanning
      ? this.renderScan()
      : this.renderDisplay();
  }

  private renderDisplay () {
    const { className, size, value } = this.props;

    return (
      <QrDisplay
        className={className}
        size={size}
        value={value}
      />
    );
  }

  private renderScan () {
    const { className, onError, onScan, size } = this.props;

    return (
      <QrScan
        className={className}
        onError={onError}
        onScan={onScan}
        size={size}
      />
    );
  }
}

export {
  QrDisplay,
  QrScan
};
