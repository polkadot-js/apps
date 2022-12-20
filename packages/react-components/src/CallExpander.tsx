// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Call } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import CallDisplay from './Call';
import Expander from './Expander';

interface Props {
  children?: React.ReactNode;
  className?: string;
  labelHash?: React.ReactNode;
  labelSignature?: React.ReactNode;
  mortality?: string;
  tip?: BN;
  value?: Call | null;
  withBorder?: boolean;
  withHash?: boolean;
  withSignature?: boolean;
}

function CallExpander ({ children, className = '', labelHash, labelSignature, mortality, tip, value, withBorder, withHash, withSignature }: Props): React.ReactElement<Props> | null {
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
        summaryHead={<div>{callName}</div>}
        summaryMeta={meta}
      >
        <CallDisplay
          callName={callName}
          labelHash={labelHash}
          labelSignature={labelSignature}
          mortality={mortality}
          tip={tip}
          value={value}
          withBorder={withBorder}
          withHash={withHash}
          withSignature={withSignature}
        />
        {children}
      </Expander>
    </div>
  );
}

export default React.memo(CallExpander);
