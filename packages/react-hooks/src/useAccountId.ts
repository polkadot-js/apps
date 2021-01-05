// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';

export function useAccountId (initialValue: string | null = null, onChangeAccountId?: (_: string | null) => void): [string | null, (_: string | null) => void] {
  const [accountId, setAccountId] = useState<string | null>(initialValue);

  const _setAccountId = useCallback(
    (accountId: string | null = null): void => {
      setAccountId(accountId);

      onChangeAccountId && onChangeAccountId(accountId);
    },
    [onChangeAccountId]
  );

  return [accountId, _setAccountId];
}
