// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { withCalls } from '@polkadot/ui-api';

import { classes } from './util';
import { AddressSummary, Props } from './AddressSummary';
import translate from './translate';

const DEFAULT_ICON_SIZE = 64;

class AddressRow extends AddressSummary {
  render () {
    const { className, style, identIconSize = DEFAULT_ICON_SIZE, isInline, value, withIndex } = this.props;

    return (
      <div
        className={classes('ui--AddressRow', !value && 'invalid', isInline && 'inline', className)}
        style={style}
      >
        <div className='ui--AddressRow-base'>
          {this.renderIcon('ui--AddressRow-icon', identIconSize)}
          {this.renderButtons()}
          <div className='ui--AddressRow-details'>
            <div className='ui--AddressSummary-data'>
              {this.renderName()}
              {this.renderAddress()}
              {this.renderAccountIndex(withIndex)}
            </div>
            {this.renderBalances()}
            {this.renderTags()}
          </div>
        </div>
        {this.renderChildren()}
        {this.renderExplorer()}
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
