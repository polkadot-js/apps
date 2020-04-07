// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import Body from './Body';
import Head from './Head';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  empty?: React.ReactNode;
  filter?: React.ReactNode;
  header: [React.ReactNode?, string?, number?, (() => void)?][];
  isFixed?: boolean;
}

function Table ({ children, className, empty, filter, header, isFixed }: TableProps): React.ReactElement<TableProps> {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <div className={`ui--Table ${className}`}>
      <table className={`${isFixed && 'isFixed'}`}>
        <Head
          filter={filter}
          header={header}
          isEmpty={isEmpty}
        />
        <Body
          empty={empty}
          isEmpty={isEmpty}
        >
          {children}
        </Body>
      </table>
    </div>
  );
}

export default React.memo(styled(Table)`
  margin-bottom: 1.5rem;
  max-width: 100%;
  width: 100%;

  table {
    border-spacing: 0;
    max-width: 100%;
    overflow: hidden;
    width: 100%;

    &.isFixed {
      table-layout: fixed;
    }

    tr {
      max-width: 100%;
      width: 100%;

      label {
        opacity: 0.42;
      }

      td, &:not(.filter) th {
        &:first-child {
          padding-left: 1.5rem;
        }

        &:last-child {
          padding-right: 1.5rem;
        }

        &.all {
          width: 100%;

          summary {
            white-space: normal;
          }
        }
      }
    }
  }
`);
