// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { AccountId, Address } from '@polkadot/types';

export type Actions = 'create' | 'edit' | 'restore' | 'forget' | 'backup' | 'changePassword';

export type ActionStatus = {
  action?: Actions | string,
  value?: AccountId | Address | string,
  success?: boolean,
  message?: string
};
