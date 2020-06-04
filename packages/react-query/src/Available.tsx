// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';
import { AccountId, Balance, AccountIndex, Address } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

import FormatBalance from './FormatBalance';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

export default function AvailableDisplay ({ children, className, label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  // TODO: query asset IDs from chain metadata
  const cennzBalance = useCall<Balance>(api.query.genericAsset.freeBalance as any, [1, params]);
  const cpayBalance = useCall<Balance>(api.query.genericAsset.freeBalance as any, [2, params]);

  return (
    <FormatBalance
      className={className}
      label={label}
      value={cpayBalance! > cennzBalance! ? cpayBalance : cennzBalance}
      symbol={cpayBalance! > cennzBalance! ? "CPAY" : "CENNZ"}
    >
      {children}
    </FormatBalance>
  );
}
