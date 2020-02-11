// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';

import { useState } from 'react';

export default function useAccountId (initialValue: StringOrNull = null, onChangeAccountId?: (_: StringOrNull) => void): [StringOrNull, (_: StringOrNull) => void] {
  const [accountId, setAccountId] = useState<StringOrNull>(initialValue);

  return [
    accountId,
    (accountId: StringOrNull = null): void => {
      setAccountId(accountId);

      onChangeAccountId && onChangeAccountId(accountId);
    }
  ];
}
