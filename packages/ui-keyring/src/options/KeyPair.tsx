// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import './KeyPair.css';

import React from 'react';
import { AccountId } from '@polkadot/types';
import IdentityIcon from '@polkadot/ui-app/IdentityIcon';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';

type Props = {
  address: string,
  className?: string,
  name: string,
  sessionValidators?: Array<AccountId>,
  style?: {
    [index: string]: string
  }
};

class KeyPair extends React.PureComponent<Props> {
  render () {
    const { address, className, name, sessionValidators = [], style } = this.props;
    const isValidator = sessionValidators.find((validator) =>
      validator.toString() === address
    );

    return (
      <div
        className={['ui--KeyPair', className].join(' ')}
        style={style}
      >
        <IdentityIcon
          className='ui--KeyPair-icon'
          isHighlight={!!isValidator}
          size={32}
          value={address}
        />
        <div className='ui--KeyPair-name'>
          {name}
        </div>
        <div className='ui--KeyPair-address'>
          {address}
        </div>
      </div>
    );
  }
}

export default withMulti(
  KeyPair,
  withObservable('sessionValidators')
);
