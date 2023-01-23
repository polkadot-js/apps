// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { useParaEndpoints } from '@polkadot/react-hooks';

import ChainImg from './ChainImg';

interface Props {
  className?: string;
  id: BN;
}

function ParaLink ({ className, id }: Props): React.ReactElement<Props> | null {
  const endpoints = useParaEndpoints(id);
  const links = useMemo(
    () => endpoints.filter(({ isDisabled, isUnreachable }) => !isDisabled && !isUnreachable),
    [endpoints]
  );

  if (!endpoints.length) {
    return null;
  }

  const { info, text, value } = links.length
    ? links[links.length - 1]
    : endpoints[0];

  return (
    <StyledDiv className={className}>
      <ChainImg
        isInline
        logo={info || 'empty'}
        withoutHl
      />
      {links.length
        ? (
          <a
            className='chainAlign'
            href={`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(value)}`}
          >{text}</a>
        )
        : text
      }
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
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
`;

export default React.memo(ParaLink);
