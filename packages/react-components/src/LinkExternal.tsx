// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkTypes } from '@polkadot/apps-config/links/types';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { externalLinks } from '@polkadot/apps-config';
import { useApi } from '@polkadot/react-hooks';

import { styled } from './styled.js';
import { useTranslation } from './translate.js';

interface Props {
  className?: string;
  data: BN | number | string;
  hash?: string;
  isText?: boolean;
  isSidebar?: boolean;
  isSmall?: boolean;
  type: LinkTypes;
  withTitle?: boolean;
}

function genLinks (systemChain: string, { data, hash, isText, type }: Props): React.ReactNode[] {
  return Object
    .entries(externalLinks)
    .map(([name, { chains, create, homepage, isActive, paths, ui }]): React.ReactNode | null => {
      const extChain = chains[systemChain];
      const extPath = paths[type];

      if (!isActive || !extChain || !extPath) {
        return null;
      }

      return (
        <a
          href={create(extChain, extPath, data, hash)}
          key={name}
          rel='noopener noreferrer'
          target='_blank'
          title={`${name}, ${homepage}`}
        >
          {isText
            ? name
            : <img src={ui.logo} />
          }
        </a>
      );
    })
    .filter((node): node is React.ReactNode => !!node);
}

function LinkExternal ({ className = '', data, hash, isSidebar, isSmall, isText, type, withTitle }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { systemChain } = useApi();

  const links = useMemo(
    () => genLinks(systemChain, { data, hash, isSidebar, isText, type }),
    [systemChain, data, hash, isSidebar, isText, type]
  );

  if (!links.length && !withTitle) {
    return null;
  }

  return (
    <StyledDiv className={`${className} ui--LinkExternal ${isText ? 'isText' : 'isLogo'} ${withTitle ? 'isMain' : ''} ${isSmall ? 'isSmall' : ''} ${isSidebar ? 'isSidebar' : ''}`}>
      {(isText && !isSmall) && <div>{t('View this externally')}</div>}
      {withTitle && (
        <h5>{t('external links')}</h5>
      )}
      <div className='links'>
        {links.length
          ? links.map((link, index) => <span key={index}>{link}</span>)
          : <div>{t('none')}</div>
        }
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  text-align: right;

  &.isMain {
    text-align: left;
  }

  &.isSmall {
    font-size: var(--font-size-small);
    line-height: 1.35;
    text-align: center;
  }

  &.isSidebar {
    text-align: center;

    .links {
      img {
        height: 2rem;
        width: 2rem;
      }
    }
  }

  &:not(.fullColor) {
    .links {
      img {
        filter: grayscale(1) opacity(0.66);

        &:hover {
          filter: grayscale(0) opacity(1);
        }
      }
    }
  }

  .links {
    img {
      border-radius: 50%;
      cursor: pointer;
      height: 1.5rem;
      width: 1.5rem;
    }

    span {
      word-wrap: normal;
      display: inline-block;
    }

    span+span {
      margin-left: 0.3rem;
    }
  }

  &.isLogo {
    line-height: 1;

    .links {
      white-space: nowrap;
    }
  }
`;

export default React.memo(LinkExternal);
