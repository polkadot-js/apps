// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Header } from '@polkadot/types/interfaces';
import { BareProps, CallProps } from '@polkadot/react-api/types';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

interface Props extends BareProps, CallProps {
  label?: React.ReactNode;
}

function BestHash ({ className, label, style }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const newHead = useCall<Header>(api.rpc.chain.subscribeNewHeads, []);

  return (
    <div
      className={className}
      style={style}
    >
      {label || ''}{newHead?.hash.toHex()}
    </div>
  );
}

export default React.memo(BestHash);
