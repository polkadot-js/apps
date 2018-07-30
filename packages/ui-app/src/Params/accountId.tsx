// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

import IdentityIcon from '@polkadot/ui-react/IdentityIcon';

const AccountId: React.ComponentType<any> = (
  (accountId: string): any => {
    return (
      <div>
        <span><IdentityIcon size={24} value={accountId} />{accountId}</span>
      </div>
    );
  }
);

export default AccountId;
