// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { useParaEndpoints } from '@polkadot/react-hooks';

import ChainImg from './ChainImg.js';
import { styled } from './styled.js';
import Icon from './Icon.js';
import { Subscan } from '@polkadot/apps-config/links/subscan';

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

function ParaLink({ className, id, type = ParaLinkType.PJS, showLogo = true }: Props): React.ReactElement<Props> | null {
  const endpoints = useParaEndpoints(id);
  const links = useMemo(
    () => endpoints.filter(({ isDisabled, isUnreachable }) => !isDisabled && !isUnreachable),
    [endpoints]
  );
  if (!endpoints.length) {
    return null;
  }

  const { text, ui, value, homepage } = links.length
    ? links[links.length - 1]
    : endpoints[0];

  const subscanUrl = text && Subscan.chains[text?.toString()] && Subscan.create(Subscan.chains[text?.toString()], '', '').toString()

  return (
    <StyledDiv className={className}>
      {showLogo && <ChainImg
        isInline
        logo={ui.logo || 'empty'}
        withoutHl
      />
      }
      {links.length ?
        (
          <>
            {type === ParaLinkType.SUBSCAN && !!subscanUrl && <a target='_blank' rel='noopener noreferrer' href={subscanUrl}>
              <img height="20" src={Subscan.ui.logo} alt="Subscan" />
            </a>}
            {type === ParaLinkType.HOME && homepage && <a target='_blank' rel='noopener noreferrer' href={homepage}>
              <Icon
                className='parent-icon'
                icon='house'
              />
            </a>}
            {type === ParaLinkType.PJS && <a
              className='chainAlign'
              href={`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(value)}`}
            >{text}</a>}
          </>
        ) : type === ParaLinkType.PJS ? text : null
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
