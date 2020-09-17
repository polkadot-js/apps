// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Hash } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Bytes, Option } from '@polkadot/types';
import { hexToString } from '@polkadot/util';

interface Props {
  hash: Hash;
}

const transformTip = {
  transform: (optBytes: Option<Bytes>) =>
    optBytes.isSome
      ? hexToString(optBytes.unwrap().toHex())
      : null
};

function TipReason ({ hash }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const reasonText = useCall<string | null>(api.query.treasury.reasons, [hash], transformTip);

  return (
    <td className='start all'>{reasonText || hash.toHex()}</td>
  );
}

export default React.memo(TipReason);
