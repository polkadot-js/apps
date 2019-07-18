// Copyright 2017-2019 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps } from './types';

import React from 'react';

import QrDisplay from './Display';
import QrScan from './Scan';

interface Props extends BaseProps {
  isScanning: boolean;
  onError?: (error: Error) => void;
  onScan?: (data: string) => void;
  size?: number;
  value?: Record<string, any>;
}

export default class Qr extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { isScanning } = this.props;

    return isScanning
      ? this.renderScan()
      : this.renderDisplay();
  }

  private renderDisplay (): React.ReactNode {
    const { className, size, value } = this.props;

    return (
      <QrDisplay
        className={className}
        size={size}
        value={value}
      />
    );
  }

  private renderScan (): React.ReactNode {
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
