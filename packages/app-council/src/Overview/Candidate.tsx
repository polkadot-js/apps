// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressCard } from '@polkadot/ui-app';

interface Props {
  address: AccountId;
}

export default class Candidate extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { address } = this.props;

    return (
      <AddressCard
        defaultName='candidate'
        value={address}
      />
    );
  }
}
