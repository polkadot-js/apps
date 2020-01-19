// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import { useState, useEffect } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

export default function useCheck (): boolean {
  const { api, isApiReady } = useApi();
  const founder = useCall<Option<AccountId>>(isApiReady ? api.query.society?.founder : undefined, []);
  const [check, setCheck] = useState(false);

  useEffect((): void => {
    setCheck(founder?.isSome || false);
  }, [founder]);

  return check;
}
