// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useAccounts } from '@polkadot/react-hooks';

export default function useCounter (): string | null {
  const { hasAccounts } = useAccounts();

  return hasAccounts ? null : '!';
}
