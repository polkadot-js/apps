// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { CopyButton } from '@polkadot/react-components';

interface Props {
  className?: string;
  value: HexString;
}

function Hash ({ className, value }: Props): React.ReactElement<Props> {
  const shortHash = useMemo(
    () => `${value.slice(0, 10)}…${value.slice(-8)}`,
    [value]
  );

  return (
    <td className={className}>
      <div className='shortHash'>{shortHash}</div>
      <CopyButton value={value} />
    </td>
  );
}

export default React.memo(styled(Hash)`
  white-space: nowrap;

  > div {
    display: inline-block;
    vertical-align: middle;
  }

  .shortHash {
    font: var(--font-mono);

    + div {
      margin-left: 0.5rem;
    }
  }
`);
