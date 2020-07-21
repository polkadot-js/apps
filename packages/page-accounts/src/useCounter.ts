// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useAccounts } from '@polkadot/react-hooks';

export default function useCounter (): string | null {
  const { hasAccounts } = useAccounts();

  return hasAccounts ? null : '!';
}
