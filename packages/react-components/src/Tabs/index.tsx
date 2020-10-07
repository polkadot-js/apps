// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ThemeProps } from '../types';
import { TabItem } from './types';

import React, { useEffect, useMemo, useRef } from 'react';
import { AccountId } from '@polkadot/types/interfaces';
import createRoutes from '@polkadot/apps-routing';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from '../translate';
import { TabsSectionDelimiter } from './TabsSectionDelimiter';
import { extractGroups } from '../../../apps/src/Menu/';
import Grouping from '../../../apps/src/Menu/Grouping';

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
  const { t } = useTranslation();
  const routeRef = useRef(createRoutes(t));

  const activeRoute = useMemo(
    () => routeRef.current.find((route) => location.pathname.startsWith(`/${route.name}`)) || routeRef.current[0],
    [location]
  );

  const { allAccounts, hasAccounts } = useAccounts();
  const apiProps = useApi();
  const sudoKey = useCall<AccountId>(apiProps.isApiReady && apiProps.api.query.sudo?.key);

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

  const hasSudo = useMemo(
    () => !!sudoKey && allAccounts.some((address) => sudoKey.eq(address)),
    [allAccounts, sudoKey]
  );

  const groupRef = useRef({
    accounts: t('Accounts'),
    developer: t('Developer'),
    governance: t('Governance'),
    network: t('Network')
  });

  const visibleGroups = useMemo(
    () => extractGroups(routeRef.current, groupRef.current, apiProps, hasAccounts, hasSudo),
    [apiProps, hasAccounts, hasSudo]
  );

  const activeGroup = useMemo(
    () => visibleGroups.find((visibleGroup) => (visibleGroup.name.toLowerCase() === activeRoute.group.toLowerCase())),
    [activeRoute.group, visibleGroups]
  );

  const filtered = hidden
    ? items.filter(({ name }) => !hidden.includes(name))
    : items;

  return (
    <div className={`ui--Tabs ${className}`}>
      {activeRoute && (
        <Grouping
          activeRoute={activeRoute}
          className='ui--ActiveTab'
          routes={activeGroup && activeGroup.routes}
          variant='active-tab'
        />
      )}
      <TabsSectionDelimiter/>
      <ul className='ui--TabsList'>
        {filtered.map((tab, index) => (
          <li
            key={tab.name}>
            <Tab
              {...tab}
              basePath={basePath}
              index={index}
              isSequence={isSequence}
              num={filtered.length}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default React.memo(styled(Tabs)(({ theme }: ThemeProps) => `
  align-items: center;
  background: ${theme.bgTabs};
  border-bottom: 1px solid ${theme.borderTabs};
  display: flex;
  margin: 0 -1.5rem;
  padding: 0 1.5rem 0;
  text-align: left;
  height: 4.35rem;
  z-index: 1;
  font-family: 'Nunito Sans',sans-serif;

  &::-webkit-scrollbar {
    display: none;
    width: 0px;
  }

  .ui--TabsList {
    display: flex;
    list-style: none;
    height: 100%;
    padding: 0 2.72rem 0 0;
    margin: 0 2.72rem;
    overflow: auto;
    white-space: nowrap;

    > li:not(:first-child) {
      margin-left: 2.57rem;
    }

    .ui--Tab {
      padding: 0;
      border: unset;
    }

    @media only screen and (max-width: 900px) {
      margin: 0 2.72rem 0 2.35rem;
    }
  }
`));
