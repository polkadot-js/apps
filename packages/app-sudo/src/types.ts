// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

export interface ComponentProps {
  allAccounts: SubjectInfo;
  isMine: boolean;
  sudoKey?: string;
}
