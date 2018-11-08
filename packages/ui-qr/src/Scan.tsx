// Copyright 2017-2018 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the APL2 license. See the LICENSE file for details.

import { BaseProps } from './types';

import './Scan.css';

import React from 'react';
import Reader from 'react-qr-reader';

type Props = BaseProps & {
  delay?: number,
  onError?: (error: Error) => void,
  onScan: (data: string | null) => void
};

const DEFAULT_DELAY = 150;
const DEFAULT_ERROR = (error: Error) => {
  console.error('@polkadot/ui-qr:Scan', error);
};

export default class Scan extends React.PureComponent<Props> {
  render () {
    const { className, delay = DEFAULT_DELAY, onError = DEFAULT_ERROR, onScan, style } = this.props;

    return (
      <Reader
        className={`ui--qr-Scan ${className}`}
        delay={delay}
        onError={onError}
        onScan={onScan}
        style={style}
      />
    );
  }
}
