// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import styled from 'styled-components';
import { Button, IdentityIcon } from '@polkadot/ui-app';
import { u8aToHex } from '@polkadot/util';

type Props = BareProps & {
  address: string;
  count: number;
  offset: number;
  onCreateToggle: (seed: string) => void,
  onRemove: (address: string) => void,
  seed: Uint8Array;
};

type State = {
  hexSeed: string
};

const Wrapper = styled.div`
  text-align: center;

  &:hover {
    background: #f9f9f9;
  }

  .vanity--Match-addr {
    font-size: 1.5rem;
    padding: 0 1rem;

    .no {
      color: inherit;
    }

    .yes {
      color: red;
    }
  }

  .vanity--Match-buttons,
  .vanity--Match-data,
  .vanity--Match-icon {
    display: inline-block;
    vertical-align: middle;
  }

  .vanity--Match-item {
    display: inline-block;
    font-family: monospace;
    margin: 0 auto;
    padding: 0.5em;
    position: relative;
  }

  .vanity--Match-seed {
    opacity: 0.45;
    padding: 0 1rem;
  }
`;

export default class Match extends React.PureComponent<Props, State> {
  state: State = {} as State;

  static getDerivedStateFromProps ({ seed }: Props): State {
    return {
      hexSeed: u8aToHex(seed)
    };
  }

  render () {
    const { address, count, offset } = this.props;
    const { hexSeed } = this.state;

    return (
      <Wrapper>
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
            <Button
              icon='plus'
              isPrimary
              onClick={this.onCreate}
              size='tiny'
            />
            <Button
              icon='close'
              isNegative
              onClick={this.onRemove}
              size='tiny'
            />
          </div>
        </div>
      </Wrapper>
    );
  }

  private onCreate = (): void => {
    const { onCreateToggle } = this.props;
    const { hexSeed } = this.state;

    onCreateToggle(hexSeed);
  }

  private onRemove = (): void => {
    const { address, onRemove } = this.props;

    onRemove(address);
  }
}
