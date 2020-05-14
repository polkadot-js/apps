// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/types';
import { EthereumAddress } from '@polkadot/types/interfaces';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

export default function usePreclaimPolkadotAddresses (): string[] {
  const { allAccounts } = useAccounts();
  const { api } = useApi();

  // Find accounts that need attest. They are accounts that
  // - already preclaimed,
  // - didn't sign the attest yet.
  // `claims.preclaims` returns the ethereum address for these accounts.
  const needAttest = useCall<string[]>(api.query.claims?.preclaims?.multi, [allAccounts], {
    transform: (preclaims: Option<EthereumAddress>[]) =>
      preclaims
        .map((opt, index): [boolean, string] => [opt.isSome, allAccounts[index]])
        .filter(([isSome]) => isSome)
        .map(([, address]) => address)
  });

  return needAttest || [];
}
