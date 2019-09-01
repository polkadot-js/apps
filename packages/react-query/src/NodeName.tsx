/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/react-api/types';

import React from 'react';
import { Text } from '@polkadot/types';
import { withCalls } from '@polkadot/react-api';

interface Props extends BareProps, CallProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  system_name?: Text;
}

export function NodeName ({ children, className, label = '', style, system_name = new Text('unknown') }: Props): React.ReactElement<Props> {
  return (
    <div
      className={className}
      style={style}
    >
      {label}{system_name.toString()}{children}
    </div>
  );
}

export default withCalls<Props>('rpc.system.name')(NodeName);
