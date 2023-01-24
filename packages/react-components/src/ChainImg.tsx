// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { chainLogos, emptyLogos, namedLogos, nodeLogos, specLogos } from '@polkadot/apps-config';
import { useApi } from '@polkadot/react-hooks';

import Icon from './Icon';

interface Props {
  className?: string;
  isInline?: boolean;
  logo?: keyof typeof namedLogos;
  onClick?: () => any;
  withoutHl?: boolean;
}

function sanitize (value?: string): string {
  return value?.toLowerCase().replace('-', ' ') || '';
}

function ChainImg ({ className = '', isInline, logo, onClick, withoutHl }: Props): React.ReactElement<Props> {
  const { specName, systemChain, systemName } = useApi();
  const [isEmpty, img, isFa] = useMemo((): [boolean, unknown, boolean] => {
    const found = logo && logo !== 'empty'
      ? namedLogos[logo]
      : chainLogos[sanitize(systemChain)] || nodeLogos[sanitize(systemName)] || specLogos[sanitize(specName)];
    const imgBase = found || emptyLogos.empty;
    const isFa = !!((imgBase as Record<string, string>).fa);
    const img = isFa
      ? (imgBase as Record<string, string>).fa
      : imgBase;

    return [!found || logo === 'empty', img, isFa];
  }, [logo, specName, systemChain, systemName]);

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
