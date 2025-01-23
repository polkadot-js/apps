// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React from 'react';

import { CopyButton, styled } from '@polkadot/react-components';

interface Props {
  className?: string;
  value: HexString;
}

function Hash ({ className = '', value }: Props): React.ReactElement<Props> {
  return (
    <StyledTd className={`${className} hash`}>
      <div className='shortHash'>{value}</div>
      <CopyButton value={value} />
    </StyledTd>
  );
}

const StyledTd = styled.td`
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
`;

export default React.memo(Hash);
