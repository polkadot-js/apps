// Copyright 2017-2023 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React from 'react';
import styled from 'styled-components';

import { CopyButton } from '@polkadot/react-components';

interface Props {
  className?: string;
  value: HexString;
}

function Hash ({ className = '', value }: Props): React.ReactElement<Props> {
  return (
    <td className={`${className} hash`}>
      <div className='shortHash'>{value}</div>
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
    + div {
      margin-left: 0.5rem;
    }
  }
`);
