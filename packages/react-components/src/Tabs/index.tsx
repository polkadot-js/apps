// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Location } from 'history';
import type { TabItem } from '../types.js';

import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { TabsCtx } from '@polkadot/react-hooks/ctx/Tabs';

import { styled } from '../styled.js';
import CurrentSection from './CurrentSection.js';
import Tab from './Tab.js';
import Delimiter from './TabsSectionDelimiter.js';

interface Props {
  className?: string;
  basePath: string;
  hidden?: string[] | null | false;
  items: (TabItem | false | null | undefined)[];
}

// redirect on invalid tabs
function redirect (basePath: string, location: Location, items: (TabItem | false | null | undefined)[], hidden?: string[] | null | false): void {
  if (location.pathname !== basePath) {
    // Has the form /staking/query/<something>
    const [,, section] = location.pathname.split('/');
    const alias = items.find((v) => v && v.alias === section);

    if (alias) {
      window.location.hash = alias.isRoot
        ? basePath
        : `${basePath}/${alias.name}`;
    } else if (hidden && (hidden.includes(section) || !items.some((v) => v && !v.isRoot && v.name === section))) {
      window.location.hash = basePath;
    }
  }
}

function Tabs ({ basePath, className = '', hidden, items }: Props): React.ReactElement<Props> {
  const location = useLocation();
  const { icon, text } = React.useContext(TabsCtx);

  const filtered = useMemo(
    () => items.filter((v): v is TabItem => !!v && (!hidden || !hidden.includes(v.name))),
    [hidden, items]
  );

  useEffect(
    () => redirect(basePath, location, items, hidden),
    [basePath, hidden, items, location]
  );

  return (
    <StyledHeader className={`${className} ui--Tabs`}>
      <div className='tabs-container'>
        {text && icon && (
          <CurrentSection
            icon={icon}
            text={text}
          />
        )}
        <Delimiter />
        <ul className='ui--TabsList'>
          {filtered.map((tab, index) => (
            <li
              className={tab.isHidden ? '--hidden' : ''}
              key={index}
            >
              <Tab
                {...tab}
                basePath={basePath}
                index={index}
                key={tab.name}
              />
            </li>
          ))}
        </ul>
      </div>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  background: var(--bg-tabs);
  border-bottom: 1px solid var(--border-tabs);
  text-align: left;
  z-index: 1;

  & .tabs-container {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    max-width: var(--width-full);
    padding: 0 1.5rem 0 0;
    height: 3.286rem;
  }

  &::-webkit-scrollbar {
    display: none;
    width: 0px;
  }

  .ui--TabsList {
    display: flex;
    height: 100%;
    list-style: none;
    margin: 0 1.4rem;
    padding: 0;
    white-space: nowrap;

    @media only screen and (max-width: 900px) {
      margin: 0 2.72rem 0 2.35rem;
    }
  }
`;

export default React.memo(Tabs);
