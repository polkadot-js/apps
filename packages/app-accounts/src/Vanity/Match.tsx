// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { Button, IdentityIcon } from '@polkadot/react-components';
import { u8aToHex } from '@polkadot/util';

interface Props extends BareProps {
  address: string;
  count: number;
  offset: number;
  onCreateToggle: (seed: string) => void;
  onRemove: (address: string) => void;
  seed: Uint8Array;
}

interface State {
  hexSeed: string;
}

class Match extends React.PureComponent<Props, State> {
  public state: State = { hexSeed: '' };

  public static getDerivedStateFromProps ({ seed }: Props): State {
    return {
      hexSeed: u8aToHex(seed)
    };
  }

  public render (): React.ReactNode {
    const { address, className, count, offset } = this.props;
    const { hexSeed } = this.state;

    return (
      <div className={className}>
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
      </div>
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

export default styled(Match as React.ComponentClass<Props, State>)`
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
