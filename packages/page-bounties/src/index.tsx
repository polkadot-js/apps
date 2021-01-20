// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import styled from 'styled-components';

import { Tabs } from '@polkadot/react-components';

import Bounties from './Bounties';
import { useTranslation } from './translate';

export { default as useCounter } from './useCounter';

interface Props {
  basePath: string;
  className?: string;
}

function BountiesApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'index',
      text: t<string>('Bounties')
    }
  ]);

  return (
    <main className={`bounties--App ${className}`}>
      <header>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
      </header>
      <Bounties/>
    </main>
  );
}

export default React.memo(styled(BountiesApp)`
  && thead th {
    padding: 0.75rem 1rem 0.57rem;
    font-weight: bold;
    font-size: 0.7rem;
    line-height: 0.85rem;
    text-transform: uppercase;
    color: #4D4D4D;
    border: none;
  }

  thead tr {
    border: none;
    background: none;
  }

  tbody td {
    padding: 1.4rem 1rem;
    vertical-align: baseline;
    font-size: 1rem;
    line-height: 1.7rem;
    color: #1A1B20;
    border-bottom: 1px solid #dfdfdf;
    
    &:first-child {
      border-left: 1px solid #dfdfdf;
    }

    &:last-child {
      border-right: 1px solid #dfdfdf;
    }
  }

  tbody tr {
    &:nth-child(odd) {
      background: #fff;
    }

    &:nth-child(odd) td {
      vertical-align: middle;
    }

    &:nth-child(even) {
      background: #fafafa;
    }
    
    &:first-child { 
      td {
        border-top: 1px solid #dfdfdf;
      }

      td:first-child {
        border-top-left-radius: 0.285rem;
      }

      td:last-child {
        border-top-right-radius: 0.285rem;
      } 
    }

    &:last-child {
      td {
        border-bottom: 1px solid #dfdfdf;
      }

      td:first-child {
        border-bottom-left-radius: 0.285rem;
      }
      td:last-child {
        border-bottom-right-radius: 0.285rem;
      } 
    }
  }
`);
