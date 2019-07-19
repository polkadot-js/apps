// Copyright 2017-2019 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps } from './types';

import React from 'react';
import qrcode from 'qrcode-generator';
import styled from 'styled-components';
import { u8aConcat } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

import { createSize } from './constants';
import { encodeNumber, decodeString } from './util';

interface Props extends BaseProps {
  size?: number;
  value: Uint8Array;
  withMulti?: boolean;
}

interface State {
  frames: string[];
  frameIdx: number;
  image: string | null;
  timerId: NodeJS.Timeout | null;
  valueHash: string | null;
}

const FRAME_DELAY = 2100;
const FRAME_SIZE = 1716;
const MULTIPART = new Uint8Array([0]);

function getDataUrl (value: string): string {
  const qr = qrcode(0, 'M');

  qr.addData(value, 'Byte');
  qr.make();

  return qr.createDataURL(16, 0);
}

function createFrames (input: Uint8Array): string[] {
  const frames = [];
  let idx = 0;

  while (idx < input.length) {
    frames.push(input.subarray(idx, idx + FRAME_SIZE));

    idx += FRAME_SIZE;
  }

  return frames.map((frame, index: number): string =>
    decodeString(u8aConcat(
      MULTIPART,
      encodeNumber(frames.length),
      encodeNumber(index),
      frame
    ))
  );
}

class Display extends React.PureComponent<Props, State> {
  public state: State = {
    frames: [],
    frameIdx: 0,
    image: null,
    timerId: null,
    valueHash: null
  };

  public static getDerivedStateFromProps ({ value, withMulti = true }: Props, prevState: State): Pick<State, never> | null {
    const valueHash = xxhashAsHex(value);

    if (valueHash === prevState.valueHash) {
      return null;
    }

    const frames: string[] = withMulti
      ? createFrames(value)
      : [decodeString(value)];

    return {
      frames,
      frameIdx: 0,
      image: getDataUrl(frames[0]),
      valueHash
    };
  }

  public componentDidMount (): void {
    this.setState({
      timerId: setInterval(this.nextFrame, FRAME_DELAY)
    });
  }

  public componentWillUnmount (): void {
    const { timerId } = this.state;

    if (timerId) {
      clearInterval(timerId);
    }
  }

  public render (): React.ReactNode {
    const { className, size, style } = this.props;
    const { image } = this.state;

    if (!image) {
      return null;
    }

    return (
      <div
        className={className}
        style={createSize(size)}
      >
        <div
          className='ui--qr-Display'
          style={style}
        >
          <img src={image} />
        </div>
      </div>
    );
  }

  private nextFrame = (): void => {
    const { frames, frameIdx } = this.state;

    if (!frames || frames.length <= 1) {
      return;
    }

    const nextIdx = frameIdx === frames.length - 1
      ? 0
      : frameIdx + 1;

    this.setState({
      frameIdx: nextIdx,
      image: getDataUrl(frames[nextIdx])
    });
  }
}

export default styled(Display as React.ComponentClass<Props>)`
  .ui--qr-Display {
    height: 100%;
    width: 100%;

    img,
    svg {
      background: white;
      height: auto !important;
      max-height: 100%;
      max-width: 100%;
      width: auto !important;
    }
  }
`;
