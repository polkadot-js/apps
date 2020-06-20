// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import Body from './Body';
import Foot from './Foot';
import Head from './Head';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  empty?: React.ReactNode;
  emptySpinner?: React.ReactNode;
  filter?: React.ReactNode;
  footer?: React.ReactNode;
  header: [React.ReactNode?, string?, number?, (() => void)?][];
  isFixed?: boolean;
}

function extractKids (children: React.ReactNode): [boolean, React.ReactNode] {
  if (!Array.isArray(children)) {
    return [!children, children];
  }

  const kids = children.filter((child) => !!child);
  const isEmpty = kids.length === 0;

  return [isEmpty, isEmpty ? null : kids];
}

function Table ({ children, className = '', empty, emptySpinner, filter, footer, header, isFixed }: TableProps): React.ReactElement<TableProps> {
  const [isEmpty, kids] = extractKids(children);

  return (
    <div className={`ui--Table ${className}`}>
      <table className={isFixed ? 'isFixed' : 'isNotFixed'}>
        <Head
          filter={filter}
          header={header}
          isEmpty={isEmpty}
        />
        <Body
          empty={empty}
          emptySpinner={emptySpinner}
        >
          {kids}
        </Body>
        <Foot
          footer={footer}
          isEmpty={isEmpty}
        />
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
        opacity: 0.6;
      }

      th label {
        opacity: 1;
      }

      &:hover label {
        opacity: 1;
      }

      td, &:not(.filter) th {
        &:first-child {
          padding-left: 1.5rem;
        }

        &:last-child {
          padding-right: 0.75rem;
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
