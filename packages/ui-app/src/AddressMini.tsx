// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';

import classes from './util/classes';
import toShortAddress from './util/toShortAddress';
import translate from './translate';

type Props = BareProps & {
  isShort?: boolean,
  value?: string
};

class AddressMini extends React.PureComponent<Props> {
  render () {
    const { className, isShort = true, style, value } = this.props;

    if (!value) {
      return null;
    }

    const shortValue = toShortAddress(value);

    return (
      <div
        className={classes('ui--AddressMini', className)}
        style={style}
      >
        <IdentityIcon
          size={24}
          value={value}
        />
        <div>{isShort ? shortValue : value}</div>
      </div>
    );
  }
}

export default translate(AddressMini);
