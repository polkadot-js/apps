// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook, useAccounts } from '@polkadot/react-hooks';

function useCounterImpl (): string | null {
  const { hasAccounts } = useAccounts();

  return hasAccounts ? null : '!';
}

export default createNamedHook('useCounter', useCounterImpl);
