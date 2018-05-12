// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-app/types';

import React from 'react';

import CopyButton from '@polkadot/ui-app/src/CopyButton';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import Balance from '@polkadot/ui-react-rx/Balance';
import Nonce from '@polkadot/ui-react-rx/Nonce';
import addressDecode from '@polkadot/util-keyring/address/decode';

type Props = BareProps & {
  value: string | null;
}

type State = {
  address: string,
  isValid: boolean,
  publicKey: Uint8Array | null,
  shortValue: string
}

const DEFAULT_ADDR = '5'.padEnd(16, 'x');
const DEFAULT_SHORT = `${DEFAULT_ADDR.slice(0, 7)}…${DEFAULT_ADDR.slice(-7)}`;

export default class Address extends React.PureComponent<Props, State> {
  state: State = ({}: $Shape<State>);

  static getDerivedStateFromProps ({ value }: Props, { publicKey, shortValue }: State): State {
    // flowlint-next-line sketchy-null-string:off
    const address = value || DEFAULT_ADDR;

    try {
      // $FlowFixMe yes, we expect a throw when invalid
      publicKey = addressDecode(value);
      shortValue = `${address.slice(0, 7)}…${address.slice(-7)}`;
    } catch (error) {
      publicKey = null;
    }

    const isValid = !!publicKey && publicKey.length === 32;

    return {
      address: isValid ? address : DEFAULT_ADDR,
      isValid,
      publicKey,
      shortValue: isValid ? shortValue : DEFAULT_SHORT
    };
  }

  render (): React$Node {
    const { className, style } = this.props;
    const { address, isValid, publicKey, shortValue } = this.state;

    return (
      <div
        className={['accounts--Address', isValid ? '' : 'invalid', className].join(' ')}
        style={style}
      >
        <IdentityIcon
          className='accounts--Address-icon'
          size={96}
          value={address}
        />
        <div className='accounts--Address-data'>
          <div className='accounts--Address-address'>
            {shortValue}
          </div>
          <CopyButton value={address} />
        </div>
        {
          !isValid
            ? null
            : [
              <Balance
                className='accounts--Address-balance'
                key='balance'
                label='balance '
                params={publicKey}
              />,
              <Nonce
                className='accounts--Address-nonce'
                key='nonce'
                params={publicKey}
              >
                {' transactions'}
              </Nonce>
            ]
        }
      </div>
    );
  }
}
