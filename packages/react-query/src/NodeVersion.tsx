/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';

import React from 'react';
import { useApi } from '@polkadot/react-hooks';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
}

export default function NodeVersion ({ children, className, label, style }: Props): React.ReactElement<Props> {
  const { systemVersion } = useApi();

  return (
    <div
      className={className}
      style={style}
    >
      {label || ''}{systemVersion}{children}
    </div>
  );
}
