// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';
import type { TabItem } from './types';

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Tab from './Tab';

interface Props {
  className?: string;
  basePath: string;
  hidden?: (string | boolean | undefined)[];
  items: TabItem[];
  isSequence?: boolean;
}

function Tabs ({ basePath, className = '', hidden, isSequence, items }: Props): React.ReactElement<Props> {
  const location = useLocation();

  // redirect on invalid tabs
  useEffect((): void => {
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
  }, [basePath, hidden, items, location]);

  const filtered = hidden
    ? items.filter(({ name }) => !hidden.includes(name))
    : items;

  return (
    <div className={`ui--Tabs ${className}`}>
      <div className='tabs-container'>
        {filtered.map((tab, index) => (
          <Tab
            {...tab}
            basePath={basePath}
            index={index}
            isSequence={isSequence}
            key={tab.name}
            num={filtered.length}
          />
        ))}
      </div>
    </div>
  );
}

export default React.memo(styled(Tabs)(({ theme }: ThemeProps) => `
  align-items: flex-end;
  background: ${theme.bgTabs};
  border-bottom: 1px solid ${theme.borderTabs};

  text-align: left;
  z-index: 1;

  & .tabs-container {
    max-width: ${theme.contentMaxWidth};
    margin: 0 auto;
    width: 100%;
    display: flex;
    padding: 1.5rem 1.5rem 0;
  }

  &::-webkit-scrollbar {
    display: none;
    width: 0px;
  }
`));
