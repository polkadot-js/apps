// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';

import CopyButton from '@polkadot/ui-app/src/CopyButton';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import u8aToHex from '@polkadot/util/u8a/toHex';

type Props = BareProps & {
  address: string;
  count: number;
  offset: number;
  onRemove: (address: string) => void,
  seed: Uint8Array;
}

type State = {
  hexSeed: string
};

export default class Match extends React.PureComponent<Props, State> {
  state: State = ({}: $Shape<State>);

  static getDerivedStateFromProps ({ seed }: Props): State {
    return {
      hexSeed: u8aToHex(seed)
    };
  }

  render (): React$Node {
    const { address, className, count, offset, style } = this.props;
    const { hexSeed } = this.state;

    return (
      <div
        className={['vanity--Match', className].join(' ')}
        style={style}
      >
        <div className='vanity--Match-item'>
          <IdentityIcon
            className='vanity--Match-icon'
            size={48}
            value={address}
          />
          <div className='vanity--Match-data'>
            <div className='vanity--Match-addr'>
              <span className='no'>{address.slice(0, offset)}</span><span className='yes'>{address.slice(offset, count + offset)}</span><span className='no'>{address.slice(count + offset)}</span>
            </div>
            <div className='vanity--Match-seed'>
              {hexSeed}
            </div>
          </div>
          <div className='vanity--Match-buttons'>
            <CopyButton value={hexSeed} />
            <Button
              icon='close'
              negative
              onClick={this.onRemove}
              size='tiny'
            />
          </div>
        </div>
      </div>
    );
  }

  onRemove = (): void => {
    const { address, onRemove } = this.props;

    onRemove(address);
  }
}
