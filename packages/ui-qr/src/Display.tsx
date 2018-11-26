// Copyright 2017-2018 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps } from './types';

import './Display.css';

import React from 'react';
import qrcode from 'qrcode-generator';

import { createSize } from './constants';

type Props = BaseProps & {
  size?: number,
  value?: { [index: string]: any }
};

type State = {
  image: string | null,
  text: string | null
};

function getDataUrl (value: string): string {
  const qr = qrcode(0, 'M');

  qr.addData(value, 'Byte');
  qr.make();

  return qr.createDataURL(16, 0);
}

export default class Display extends React.PureComponent<Props, State> {
  state = {
    image: null,
    text: null
  };

  static getDerivedStateFromProps ({ value }: Props, prevState: State) {
    const text = JSON.stringify(value);

    if (text === prevState.text) {
      return null;
    }

    return {
      image: getDataUrl(text),
      text
    };
  }

  render () {
    const { className, size, style } = this.props;
    const { image } = this.state;

    if (!image) {
      return null;
    }

    return (
      <div style={createSize(size)}>
        <div
          className={`ui--qr-Display ${className}`}
          style={style}
        >
          <img src={image} />
        </div>
      </div>
    );
  }
}
