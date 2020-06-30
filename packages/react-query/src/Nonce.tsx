// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

interface Props {
  callOnResult?: (accountNonce: BN) => void;
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  params?: string | null;
}

function Nonce ({ children, className = '', label, params }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances.all, [params]);

  return (
    <div className={className}>
      {label || ''}{formatNumber(allBalances?.accountNonce)}{children}
    </div>
  );
}

export default React.memo(Nonce);
