// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TabItem } from './types';

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
  );
}

export default React.memo(styled(Tabs)`
  border-bottom: 1px solid #e6e6e6;
  margin: 0 -2em;
  overflow-x: scroll;
  padding: 2em 2em 0.75rem;
  text-align: left;

  &::-webkit-scrollbar {
    display: none;
    width: 0px;
  }
`);
