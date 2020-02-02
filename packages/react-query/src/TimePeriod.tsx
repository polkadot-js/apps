// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';

import React from 'react';
import { useApi } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
}

export default function TimePeriod ({ children, className, label, style }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const minimumPeriod = api.consts?.timestamp?.minimumPeriod;

  return (
    <div
      className={className}
      style={style}
    >
      {label || ''}{
        api.consts?.babe?.expectedBlockTime
          ? `${formatNumber(api.consts.babe.expectedBlockTime.toNumber() / 1000)}s`
          : minimumPeriod
            ? `${formatNumber(minimumPeriod.gtn(1000) ? (minimumPeriod.toNumber() / 500) : (minimumPeriod.toNumber() * 2))}s`
            : '-'
      }{children}
    </div>
  );
}
