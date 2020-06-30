// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
      <div>{section}.{method}</div>
      <Expander summaryMeta={meta}>
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
