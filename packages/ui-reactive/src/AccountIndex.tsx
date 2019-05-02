// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { AccountId, AccountIndex } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & {
  children?: React.ReactNode,
  label?: string,
  params?: string,
  accounts_idAndIndex?: [AccountId?, AccountIndex?]
};

export class AccountIndexDisplay extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', style, accounts_idAndIndex = [] } = this.props;
    const [, accountIndex] = accounts_idAndIndex;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          accountIndex
            ? accountIndex.toString()
            : '-'
          }{children}
      </div>
    );
  }
}

export default withCalls<Props>(
  ['derive.accounts.idAndIndex', { paramName: 'params' }]
)(AccountIndexDisplay);
