// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

import IdentityIcon from '@polkadot/ui-react/IdentityIcon';

import classes from './util/classes';
import { AddressSummary } from './AddressSummary';
import translate from './translate';

class AddressRow extends AddressSummary {
  render () {
    const { className, style, identIconSize } = this.props;
    const { address, isValid } = this.state;

    return (
      <div
        className={classes('ui--AddressRow', !isValid && 'invalid', className)}
        style={style}
      >
        <div className='ui--AddressRow-base'>
          <IdentityIcon
            className='ui--AddressRow-icon'
            size={identIconSize}
            value={address}
          />
          <div className='ui--AddressRow-details'>
            {this.renderAddress()}
            {this.renderBalance()}
            {this.renderNonce()}
            {this.renderChildren()}
          </div>
        </div>
      </div>
    );
  }
}

export default translate(AddressRow);
