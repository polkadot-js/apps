// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Location } from 'history';
import type { SectionType, TabItem } from './types';

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import CurrentSection from './CurrentSection';
import Tab from './Tab';
import Delimiter from './TabsSectionDelimiter';

export const TabsContext = React.createContext<SectionType>({});

interface Props {
  className?: string;
  basePath: string;
  hidden?: string[] | null | false;
  items: TabItem[];
}

// redirect on invalid tabs
function redirect (basePath: string, location: Location, items: TabItem[], hidden?: string[] | null | false): void {
  if (location.pathname !== basePath) {
    // Has the form /staking/query/<something>
    const [,, section] = location.pathname.split('/');
    const alias = items.find(({ alias }) => alias === section);

    if (alias) {
      window.location.hash = alias.isRoot
        ? basePath
        : `${basePath}/${alias.name}`;
    } else if (hidden && (hidden.includes(section) || !items.some(({ isRoot, name }) => !isRoot && name === section))) {
      window.location.hash = basePath;
    }
  }
}

function Tabs ({ basePath, className = '', hidden, items }: Props): React.ReactElement<Props> {
  const location = useLocation();
  const { icon, text } = React.useContext(TabsContext);

  useEffect(
    () => redirect(basePath, location, items, hidden),
    [basePath, hidden, items, location]
  );

  const filtered = hidden
    ? items.filter(({ name }) => !hidden.includes(name))
    : items;

  return (
    <header className={`ui--Tabs ${className}`}>
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
            <li key={index}>
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
    </header>
  );
}

export default React.memo(styled(Tabs)`
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
    list-style: none;
    height: 100%;
    margin: 0 1.4rem;
    white-space: nowrap;
    padding: 0;

    @media only screen and (max-width: 900px) {
      margin: 0 2.72rem 0 2.35rem;
    }
  }
`);
