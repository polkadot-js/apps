// Copyright 2017-2018 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the APL2 license. See the LICENSE file for details.

import { BaseProps } from './types';

import './QrScan.css';

import React from 'react';
import Reader from 'react-qr-reader';

type Props = BaseProps & {
  delay?: number,
  onError?: (error: Error) => void,
  onScan: (data: string | null) => void
};

const DEFAULT_DELAY = 100;
const DEFAULT_ERROR = (error: Error) => {
  console.error('QrScan', error);
};
const DEFAULT_STYLE = {
  display: 'inline-block',
  width: '100%',
  height: '100%'
};

export default class QrScan extends React.PureComponent<Props> {
  render () {
    const { className, delay = DEFAULT_DELAY, onError = DEFAULT_ERROR, onScan, style = DEFAULT_STYLE } = this.props;

    return (
      <Reader
        className={`ui--qr-QrScan ${className}`}
        delay={delay}
        onError={onError}
        onScan={onScan}
        style={style}
      />
    );
  }
}
