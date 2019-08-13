// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

import addressToAddress from './util/toAddress';
import IdentityIcon from './IdentityIcon';
import Input from './Input';

interface Props extends BareProps {
  help?: React.ReactNode;
  label?: React.ReactNode;
  onChange?: (address: string | null) => void;
}

interface State {
  address: string | null;
  isError: boolean;
}

class InputAddressSimple extends React.PureComponent<Props, State> {
  public state: State = {
    address: null,
    isError: true
  };

  public render (): React.ReactNode {
    const { className, help, label } = this.props;
    const { address, isError } = this.state;

    return (
      <div className={className}>
        <Input
          help={help}
          isError={isError}
          label={label}
          onChange={this.onChange}
        />
        <IdentityIcon
          className='ui--InputAddressSimpleIcon'
          size={32}
          value={address}
        />
      </div>
    );
  }

  private onChange = (_address: string): void => {
    const { onChange } = this.props;
    const address = addressToAddress(_address) || null;

    this.setState({ address, isError: !address }, (): void => {
      onChange && onChange(address);
    });
  }
}

export default styled(InputAddressSimple)`
  position: relative;

  .ui--InputAddressSimpleIcon {
    background: #eee;
    border: 1px solid #888;
    border-radius: 50%;
    left: 0.75rem;
    position: absolute;
    top: 1rem;
  }
`;
