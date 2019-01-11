// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { withCall, withMulti } from '@polkadot/ui-api/index';

import classes from './util/classes';
import { AddressSummary } from './AddressSummary';
import translate from './translate';

class AddressRow extends AddressSummary {
  render () {
    const { className, style, identIconSize = 64, value } = this.props;

    return (
      <div
        className={classes('ui--AddressRow', !value && 'invalid', className)}
        style={style}
      >
        <div className='ui--AddressRow-base'>
          {this.renderIcon('ui--AddressRow-icon', identIconSize)}
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

export default withMulti(
  AddressRow,
  translate,
  withCall('derive.balances.accountIdAndIndex', { paramProp: 'value' }),
  withCall('query.session.validators')
);
