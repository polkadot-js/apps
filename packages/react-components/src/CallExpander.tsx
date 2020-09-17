// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Call } from '@polkadot/types/interfaces';

import React from 'react';
import { registry } from '@polkadot/react-api';

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
  const { meta, method, section } = registry.findMetaCall(value.callIndex);

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
