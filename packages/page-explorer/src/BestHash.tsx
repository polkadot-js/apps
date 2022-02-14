// Copyright 2017-2022 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Header } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  label?: React.ReactNode;
}

function BestHash ({ className = '', label }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const newHead = useCall<Header>(api.rpc.chain.subscribeNewHeads);

  return (
    <div className={className}>
      {label || ''}{newHead?.hash.toHex()}
    </div>
  );
}

export default React.memo(BestHash);
