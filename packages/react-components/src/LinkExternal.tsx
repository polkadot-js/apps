// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkTypes } from '@polkadot/apps-config/links/types';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { externalLinks } from '@polkadot/apps-config';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  data: BN | number | string;
  hash?: string;
  isLogo?: boolean;
  isSidebar?: boolean;
  isSmall?: boolean;
  type: LinkTypes;
}

// function shortName (name: string): string {
//   return `${name[0]}${name[name.length - 1]}`;
// }

function genLinks (systemChain: string, { data, hash, isLogo, isSidebar, type }: Props): React.ReactNode[] {
  return Object
    .entries(externalLinks)
    .map(([name, { chains, create, isActive, logo, paths, url }]): React.ReactNode | null => {
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
          title={`${name}, ${url}`}
        >
          {isLogo
            ? (
              <img
                className={`${isSidebar ? ' isSidebar' : ''}`}
                src={logo}
              />
            )
            : name
          }
        </a>
      );
    })
    .filter((node): node is React.ReactNode => !!node);
}

function LinkExternal ({ className = '', data, hash, isLogo, isSidebar, isSmall, type }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { systemChain } = useApi();
  const links = useMemo(
    () => genLinks(systemChain, { data, hash, isLogo, isSidebar, type }),
    [systemChain, data, hash, isLogo, isSidebar, type]
  );

  if (!links.length) {
    return null;
  }

  return (
    <div className={`${className}${isLogo ? ' isLogo' : ''}${isSmall ? ' isSmall' : ''}${isSidebar ? ' isSidebar' : ''}`}>
      {!(isLogo || isSmall) && <div>{t<string>('View this externally')}</div>}
      <div className='links'>{links.map((link, index) => <span key={index}>{link}</span>)}</div>
    </div>
  );
}

export default React.memo(styled(LinkExternal)`
  text-align: right;

  &.isSmall {
    font-size: 0.85rem;
    line-height: 1.35;
    text-align: center;
  }

  &.isSidebar {
    text-align: center;
  }

  .links {
    img {
      border-radius: 50%;
      cursor: pointer;
      filter: grayscale(1) opacity(0.66);
      height: 1.5rem;
      width: 1.5rem;

      &.isSidebar {
        height: 2rem;
        width: 2rem;
      }

      &:hover {
        filter: grayscale(0) opacity(1);
      }
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
`);
