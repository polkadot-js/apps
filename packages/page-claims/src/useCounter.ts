// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/types';
import { EthereumAddress } from '@polkadot/types/interfaces';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

export default function useCounter (): number {
  const { allAccounts } = useAccounts();
  const { api, isApiReady } = useApi();

  // Find accounts that need attest. They are accounts that
  // - already preclaimed,
  // - didn't sign the attest yet.
  // `claims.preclaims` returns Some() for these accounts.
  const needAttest = useCall<[Option<EthereumAddress>]>(isApiReady && api.query.claims?.preclaims?.multi, [allAccounts])?.filter((opt) => opt.isSome);

  return needAttest ? needAttest.length : 0;
}
