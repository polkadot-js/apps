// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// If you need to display a validator´s address, this is the component
// you should use.

import React from 'react';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';

import './index.css';

import classes from '../util/classes';
import { AddressSummary } from '../AddressSummary';
import translate from '../translate';
import Icon from '@polkadot/ui-app/Icon';

class AddressValidator extends AddressSummary {
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
          <Icon
            className='validator-icon'
            loading
            name='setting' />
          <div className='ui--AddressRow-details'>
            {this.renderAddress()}
            {this.renderBalance()}
          </div>
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}

export default translate(AddressValidator);
