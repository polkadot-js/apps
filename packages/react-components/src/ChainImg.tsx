// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import React, { useMemo } from 'react';

import { createWsEndpoints } from '@polkadot/apps-config';
import { externalEmptySVG } from '@polkadot/apps-config/ui/logos/external';
import { useApi } from '@polkadot/react-hooks';

import Icon from './Icon.js';
import { styled } from './styled.js';

interface Props {
  className?: string;
  isInline?: boolean;
  logo?: string;
  onClick?: () => any;
  withoutHl?: boolean;
}

const endpoints = createWsEndpoints(() => '');

function ChainImg ({ className = '', isInline, logo, onClick, withoutHl }: Props): React.ReactElement<Props> {
  const { apiEndpoint } = useApi();
  const [isEmpty, img, isFa] = useMemo((): [boolean, unknown, boolean] => {
    const endpoint = endpoints.find((o) => o.info === logo);
    const found = endpoint?.ui.logo || logo || apiEndpoint?.ui.logo;
    const imgBase = found || externalEmptySVG;
    const [isFa, img] = !imgBase || imgBase === 'empty' || !(imgBase.startsWith('data:') || imgBase.startsWith('fa;'))
      ? [false, externalEmptySVG]
      : imgBase.startsWith('fa;')
        ? [true, imgBase.substring(3)]
        : [false, imgBase];

    return [!found || logo === 'empty', img, isFa];
  }, [apiEndpoint, logo]);

  const iconClassName = `${className} ui--ChainImg ${(isEmpty && !withoutHl) ? 'highlight--bg' : ''} ${isInline ? 'isInline' : ''}`;

  return isFa
    ? (
      <StyledIcon
        className={iconClassName}
        icon={img as IconName}
      />
    )
    : (
      <StyledImg
        alt='chain logo'
        className={iconClassName}
        onClick={onClick}
        src={img as string}
      />
    );
}

const STYLE = `
  background: white;
  border-radius: 50%;
  box-sizing: border-box;
  color: #333;

  &.isInline {
    display: inline-block;
    height: 24px;
    margin-right: 0.75rem;
    vertical-align: middle;
    width: 24px;
  }
`;

const StyledIcon = styled(Icon)`${STYLE}`;
const StyledImg = styled.img`${STYLE}`;

export default React.memo(ChainImg);
