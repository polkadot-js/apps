// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { withCalls } from '@polkadot/ui-api';

import { classes } from './util';
import { AddressSummary, Props } from './AddressSummary';
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
            {this.renderBonded()}
            {this.renderNonce()}
          </div>
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}

export default translate(
  withCalls<Props>(
    ['derive.accounts.idAndIndex', { paramName: 'value' }],
    'query.session.validators'
  )(AddressRow)
);
