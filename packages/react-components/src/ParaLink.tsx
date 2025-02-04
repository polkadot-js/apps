// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { Subscan } from '@polkadot/apps-config/links/subscan';
import { useParaEndpoints } from '@polkadot/react-hooks';

import ChainImg from './ChainImg.js';
import Icon from './Icon.js';
import { styled } from './styled.js';

export enum ParaLinkType {
  PJS = 'pjs',
  HOME = 'home',
  SUBSCAN = 'subscan'
}

interface Props {
  className?: string;
  id: BN;
  showLogo?: boolean;
  type?: ParaLinkType;
}

function ParaLink ({ className, id, showLogo = true, type = ParaLinkType.PJS }: Props): React.ReactElement<Props> | null {
  const endpoints = useParaEndpoints(id);
  const links = useMemo(
    () => endpoints.filter(({ isDisabled, isUnreachable }) => !isDisabled && !isUnreachable),
    [endpoints]
  );

  if (!endpoints.length) {
    return null;
  }

  const { homepage, text, ui, value } = links.length
    ? links[links.length - 1]
    : endpoints[0];

  const subscanUrl = text &&
    typeof text === 'string' &&
    Subscan.chains[text] &&
    Subscan.create(Subscan.chains[text], '', '').toString();

  return (
    <StyledDiv className={className}>
      {showLogo && (
        <ChainImg
          isInline
          logo={ui.logo || 'empty'}
          withoutHl
        />
      )}
      {links.length
        ? (
          <>
            {type === ParaLinkType.SUBSCAN && !!subscanUrl && (
              <a
                href={subscanUrl}
                rel='noopener noreferrer'
                target='_blank'
              >
                <img
                  alt='Subscan'
                  height='20'
                  src={Subscan.ui.logo}
                />
              </a>
            )}
            {type === ParaLinkType.HOME && homepage && (
              <a
                href={homepage}
                rel='noopener noreferrer'
                target='_blank'
              >
                <Icon
                  className='parent-icon'
                  icon='house'
                />
              </a>
            )}
            {type === ParaLinkType.PJS && (
              <a
                className='chainAlign'
                href={`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(value)}`}
              >
                {typeof text === 'string' ? text : text?.toString()}
              </a>
            )}
          </>
        )
        : type === ParaLinkType.PJS ? (typeof text === 'string' ? text : text?.toString()) : null
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
