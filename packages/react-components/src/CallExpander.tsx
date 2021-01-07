// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Call } from '@polkadot/types/interfaces';

import React from 'react';

import CallDisplay from './Call';
import Expander from './Expander';

interface Props {
  children?: React.ReactNode;
  className?: string;
  labelHash?: React.ReactNode;
  value: Call;
  withHash?: boolean;
}

function CallExpander ({ children, className = '', labelHash, value, withHash }: Props): React.ReactElement<Props> {
  const { meta, method, section } = value.registry.findMetaCall(value.callIndex);

  return (
    <div className={`ui--CallExpander ${className}`}>
      <Expander
        summaryHead={<div>{section}.{method}</div>}
        summaryMeta={meta}
      >
        <CallDisplay
          labelHash={labelHash}
          value={value}
          withHash={withHash}
        />
        {children}
      </Expander>
    </div>
  );
}

export default React.memo(CallExpander);
