// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useApi, useBrokerStatus } from '@polkadot/react-hooks';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

function Timeslice ({ children, className }: Props): React.ReactElement<Props> | null {
  const { api, isApiReady } = useApi();
  const info = useBrokerStatus(api, isApiReady);

  return (
    <div className={className}>
      {info?.lastTimeslice || '-'}
      {children}
    </div>);
}

export default React.memo(Timeslice);
