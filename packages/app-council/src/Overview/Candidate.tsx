// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressCard } from '@polkadot/react-components';

interface Props {
  address: AccountId;
}

function Candidate ({ address }: Props): React.ReactElement<any> {
  return (
    <AddressCard
      defaultName='candidate'
      value={address}
    />
  );
}

export default Candidate;
