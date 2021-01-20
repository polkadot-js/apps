// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import keyring from '@polkadot/ui-keyring';
import { KeyringItemType, KeyringJson$Meta } from '@polkadot/ui-keyring/types';

export default function getAddressMeta (address: string, type: KeyringItemType | null = null): KeyringJson$Meta {
  let meta: KeyringJson$Meta | undefined;

  try {
    const pair = keyring.getAddress(address, type);

    meta = pair && pair.meta;
  } catch (error) {
    // we could pass invalid addresses, so it may throw
  }

  return meta || {};
}
