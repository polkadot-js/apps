// Copyright 2017-2019 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps } from './types';

import React from 'react';
import Reader from 'react-qr-reader';
import styled from 'styled-components';

import { createSize } from './constants';

interface Props extends BaseProps {
  delay?: number;
  onError?: (error: Error) => void;
  onScan?: (data: string) => void;
  size?: number;
}

const DEFAULT_DELAY = 150;
const DEFAULT_ERROR = (error: Error): void => {
  console.error('@polkadot/ui-qr:Scan', error.message);
};

class Scan extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, delay = DEFAULT_DELAY, size, style } = this.props;

    return (
      <div
        className={className}
        style={createSize(size)}
      >
        <Reader
          className='ui--qr-Scan'
          delay={delay}
          onError={this.onError}
          onScan={this.onScan}
          style={style}
        />
      </div>
    );
  }

  private onError = (error: Error): void => {
    const { onError = DEFAULT_ERROR } = this.props;

    onError(error);
  }

  private onScan = (data: string | null): void => {
    const { onScan } = this.props;

    if (!data || !onScan) {
      return;
    }

    onScan(data);
  }
}

export default styled(Scan)`
  .ui--qr-Scan {
    display: inline-block;
    height: 100%;
    width: 100%;

    video {
      margin: 0;
    }
  }
`;
