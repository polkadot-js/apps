// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Call } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import CallDisplay from './Call';
import Expander from './Expander';

interface Props {
  children?: React.ReactNode;
  className?: string;
  idString?: string;
  labelHash?: React.ReactNode;
  stringId?: string;
  value?: Call | null;
  withHash?: boolean;
}

function CallExpander ({ children, className = '', labelHash, stringId, value, withHash }: Props): React.ReactElement<Props> | null {
  const call = useMemo(
    () => value && value.callIndex
      ? value.registry.findMetaCall(value.callIndex)
      : null,
    [value]
  );

  if (!call) {
    return null;
  }

  const { meta, method, section } = call;
  const callName = `${section}.${method}`;

  return (
    <div className={`ui--CallExpander ${className}`}>
      <Expander
        summaryHead={<div>{stringId && `#${stringId}: `}{callName}</div>}
        summaryMeta={meta}
      >
        <CallDisplay
          callName={callName}
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
