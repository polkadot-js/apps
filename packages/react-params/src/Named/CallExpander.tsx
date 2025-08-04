// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Call, Extrinsic } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { Expander } from '@polkadot/react-components';

import CallDisplay from './Call.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  idString?: string;
  isHeader?: boolean;
  labelHash?: React.ReactNode;
  labelSignature?: React.ReactNode;
  mortality?: string;
  onError?: () => void;
  stringId?: string;
  tip?: BN;
  value?: Call | Extrinsic | null;
  withBorder?: boolean;
  withHash?: boolean;
  withSignature?: boolean;
  isExpanded?: boolean
}

function CallExpander ({ children, className = '', isExpanded, isHeader, labelHash, labelSignature, mortality, onError, stringId, tip, value, withBorder, withHash, withSignature }: Props): React.ReactElement<Props> | null {
  const call = useMemo(
    () => value?.callIndex
      ? value.registry.findMetaCall(value.callIndex)
      : null,
    [value]
  );

  if (!call || !value) {
    return null;
  }

  const { meta, method, section } = call;
  const callName = `${section}.${method}`;

  return (
    <div className={`${className} ui--CallExpander`}>
      <Expander
        isHeader={isHeader}
        isLeft
        isOpen={isExpanded}
        summaryHead={
          <>{stringId && `#${stringId}: `}{callName}</>
        }
        summaryMeta={meta}
      >
        <CallDisplay
          callName={callName}
          labelHash={labelHash}
          labelSignature={labelSignature}
          mortality={mortality}
          onError={onError}
          tip={tip}
          value={value}
          withBorder={withBorder}
          withExpander
          withHash={withHash}
          withSignature={withSignature}
        />
        {children}
      </Expander>
    </div>
  );
}

export default React.memo(CallExpander);
