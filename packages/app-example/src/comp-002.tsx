// Copyright 2017-2018 @polkadot/app-example authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

import storage from '@polkadot/storage';
import withStorageDiv from '@polkadot/ui-react-rx/with/storageDiv';
import encodeAddress from '@polkadot/util-keyring/address/encode';

const method = storage.staking.public.intentions;

const Comp: React.ComponentType<any> = withStorageDiv(method)(
  (value: Uint8Array[]): string => {
    if (!value || !value.length) {
      return 'No intentions found';
    }

    return value.map(encodeAddress).join(', ');
  }
);

export default Comp;
