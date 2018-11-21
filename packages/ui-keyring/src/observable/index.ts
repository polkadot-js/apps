// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import accounts from './accounts';
import addresses from './addresses';

export default combineLatest(
  accounts.subject,
  addresses.subject
).pipe(
  map(([accounts, addresses]) => ({
    accounts,
    addresses
  }))
);
