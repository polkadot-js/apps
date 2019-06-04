// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { AddressCard } from '@polkadot/ui-app';

type Props = {
  address: string
};

export default class Candidate extends React.PureComponent<Props> {
  render () {
    const { address } = this.props;

    return (
      <AddressCard
        defaultName='candidate'
        value={address}
      />
    );
  }
}
