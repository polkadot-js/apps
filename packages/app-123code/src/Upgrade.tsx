// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';

type Props = {
  accountId?: string
};
type State = {
  amount?: BN;
  recipientId?: string;
};

export default class Upgrade extends React.PureComponent<Props> {
  state: State = {};

  render () {
    return (
      <section>
        <h1>upgrade</h1>
        <div className='template--2-columns'>
          <article className='template--column'>
            select
          </article>
          <div className='template--column template--summary'>bar</div>
        </div>
      </section>
    );
  }
}
