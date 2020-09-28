// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StringOrNull } from '@polkadot/react-components/types';

import { useCallback, useState } from 'react';

export default function useAccountId (initialValue: StringOrNull = null, onChangeAccountId?: (_: StringOrNull) => void): [StringOrNull, (_: StringOrNull) => void] {
  const [accountId, setAccountId] = useState<StringOrNull>(initialValue);

  const _setAccountId = useCallback(
    (accountId: StringOrNull = null): void => {
      setAccountId(accountId);

      onChangeAccountId && onChangeAccountId(accountId);
    },
    [onChangeAccountId]
  );

  return [accountId, _setAccountId];
}
