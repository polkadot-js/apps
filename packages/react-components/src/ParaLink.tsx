// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import React from 'react';
import styled from 'styled-components';

import { useParaEndpoints } from '@polkadot/react-hooks';

import ChainImg from './ChainImg';

interface Props {
  className?: string;
  id: BN;
}

function ParaLink ({ className, id }: Props): React.ReactElement<Props> | null {
  const endpoints = useParaEndpoints(id);

  if (!endpoints.length) {
    return null;
  }

  const { info, text, value } = endpoints[endpoints.length - 1];

  return (
    <div className={className}>
      <ChainImg
        isInline
        logo={info || 'empty'}
        withoutHl
      />
      <a
        className='chainAlign'
        href={`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(value)}`}
      >{text}</a>
    </div>
  );
}

export default React.memo(styled(ParaLink)`
  vertical-align: middle;
  white-space: nowrap;

  a.chainAlign {
    display: inline-block;
    height: 24px;
    line-height: 24px;
    max-width: 10em;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
`);
