// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { UInt } from '@polkadot/types';
import { bnToBn, isBn, isUndefined } from '@polkadot/util';

interface Props {
  className?: string;
  percent?: BN | number;
  total?: UInt | BN | number;
  value?: UInt | BN | number;
}

function Progress ({ className = '', percent, total, value }: Props): React.ReactElement<Props> | null {
  const _total = bnToBn(total);
  const _value = bnToBn(value);
  const width = _total.gtn(0)
    ? (100.0 * _value.toNumber() / _total.toNumber())
    : isBn(percent)
      ? percent.toNumber()
      : percent;

  if (isUndefined(width) || width < 0) {
    return null;
  }

  return (
    <div className={`ui--Progress ${className}`}>
      <div style={{ width: `${width}%` }} />
    </div>
  );
}

export default React.memo(styled(Progress)`
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  margin: 1em 0 2.5em;
  overflow: hidden;

  > div {
    height: 0.25rem;
    min-width: 0;
  }
`);
