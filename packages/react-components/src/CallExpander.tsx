// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Call, Extrinsic } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import CallDisplay from './Call';
import Expander from './Expander';

interface Props {
  children?: React.ReactNode;
  className?: string;
  idString?: string;
  isHeader?: boolean;
  labelHash?: React.ReactNode;
  labelSignature?: React.ReactNode;
  mortality?: string;
  stringId?: string;
  tip?: BN;
  value?: Call | Extrinsic | null;
  withBorder?: boolean;
  withHash?: boolean;
  withSignature?: boolean;
}

function CallExpander ({ children, className = '', isHeader, labelHash, labelSignature, mortality, stringId, tip, value, withBorder, withHash, withSignature }: Props): React.ReactElement<Props> | null {
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
        isLeft
        summaryHead={
          isHeader
            ? <h1>{stringId && `#${stringId}: `}{callName}</h1>
            : <div>{stringId && `#${stringId}: `}{callName}</div>
        }
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

export default React.memo(styled(CallExpander)`
  .ui--Expander-summary-header {
    h1 {
      font-size: 1.25rem;
      text-transform: none;
    }
  }
`);
