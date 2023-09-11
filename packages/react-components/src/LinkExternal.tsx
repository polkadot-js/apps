// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { LinkTypes } from '@polkadot/apps-config/links/types';
import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';

import { externalLinks } from '@polkadot/apps-config';
import { useApi, useTheme } from '@polkadot/react-hooks';

import { styled } from './styled.js';
import { useTranslation } from './translate.js';

type Props = {
  className?: string;
  data: BN | number | string;
  hash?: string;
  isText?: boolean;
  isSidebar?: boolean;
  isSmall?: boolean;
  type: LinkTypes;
  withTitle?: boolean;
};

type GetLinksOptions = {
  api: ApiPromise;
  data: BN | number | string;
  hash?: string;
  isText?: boolean;
  themeType: 'dark' | 'light';
  type: LinkTypes;
}

async function genLinks (
  systemChain: string,
  { api, data, hash, isText, themeType, type }: GetLinksOptions
): Promise<React.ReactElement[]> {
  const linksPromises = Object
    .entries(externalLinks)
    .map(async ([name, { chains, create, homepage, isActive, paths, ui }]): Promise<React.ReactElement | null> => {
      const extChain = chains[systemChain];
      const extPath = paths[type];

      if (!isActive || !extChain || !extPath) {
        return null;
      }

      const href = await create(extChain, extPath, data, hash, api);

      if (!href) {
        return null;
      }

      return (
        <a
          href={href}
          key={name}
          rel='noopener noreferrer'
          target='_blank'
          title={`${name}, ${homepage}`}
        >
          {isText
            ? name
            : <img src={ui.logo[themeType]} />
          }
        </a>
      );
    });

  try {
    const linksOrNulls = await Promise.all(linksPromises);

    return linksOrNulls.filter((node): node is React.ReactElement => !!node);
  } catch {
    return [];
  }
}

function LinkExternal ({ className = '', data, hash, isSidebar, isSmall, isText, type, withTitle }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const theme = useTheme();
  const { api, systemChain } = useApi();
  const [links, setLinks] = useState<React.ReactElement[]>();

  useEffect(() => {
    genLinks(systemChain, { api, data, hash, isText, themeType: theme.theme, type })
      .then(setLinks)
      .catch(console.error);
  }, [api, systemChain, data, hash, isText, theme.theme, type]);

  if (!links?.length && !withTitle) {
    return null;
  }

  return (
    <StyledDiv className={`${className} ui--LinkExternal ${isText ? 'isText' : 'isLogo'} ${withTitle ? 'isMain' : ''} ${isSmall ? 'isSmall' : ''} ${isSidebar ? 'isSidebar' : ''}`}>
      {(isText && !isSmall) && <div>{t<string>('View this externally')}</div>}
      {withTitle && (
        <h5>{t('external links')}</h5>
      )}
      <div className='links'>
        {links?.length
          ? links.map((link, index) => <span key={index}>{link}</span>)
          : <div>{t<string>('none')}</div>
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
