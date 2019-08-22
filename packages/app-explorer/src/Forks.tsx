/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';
import { Header } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { withCalls, withMulti } from '@polkadot/react-api';
import { formatNumber, hexToU8a, u8aToHex } from '@polkadot/util';

import translate from './translate';

const MAX_HEADS = 300;

interface Props extends ApiProps, I18nProps {
  className?: string;
  subscribeFinalizedHeads?: Header;
  subscribeNewHead?: Header;
}

interface ForkHeader {
  count: number;
  hash?: string;
  parent?: string;
}

type ForkHeaders = Record<string, ForkHeader[]>;

interface State {
  all: [string, ForkHeader[]][];
  fin: Map<string, boolean>;
  finHeads: Header[];
  newHeads: Header[];
}

function mapToColumns (newHeads: Header[]): ForkHeaders {
  let maxColumns = 1;

  return newHeads.reduce((all: ForkHeaders, header, index): ForkHeaders => {
    const num = formatNumber(header.number);
    const cnum = formatNumber(header.number.unwrap().addn(1));
    const hash = header.hash.toHex();
    const parent = header.parentHash.toHex();
    const entry = { count: 1, hash, parent };

    // this is our first entry, so just add it to a column, get out
    if (index === 0) {
      all[num] = [entry];
      maxColumns = 1;

      return all;
    }

    // if we don't have a row yet for this number, add one
    if (!all[num]) {
      all[num] = [];
    }

    // first-off, check to see if we already have an entry for this one, if so, get out
    if (all[num].find((entry): boolean => !!entry && entry.hash === hash)) {
      return all;
    }

    // check our children (preceding) and add to all applicable columns
    let hasChildren = false;

    if (all[cnum]) {
      all[cnum].forEach((child, index): void => {
        if (child.parent === hash) {
          all[num][index] = entry;
          hasChildren = true;
        }
      });
    }

    // we don't have children, so create a new column and add us to it
    if (!hasChildren) {
      all[num][maxColumns] = entry;
      maxColumns++;
    }

    return all;
  }, {});
}

function flattenColumns (all: ForkHeaders): ForkHeaders {
  return Object.entries(all).reduce((all: ForkHeaders, [bn, columns]): ForkHeaders => {
    all[bn] = [columns[0] || { count: 1 }];

    for (let i = 1; i < columns.length; i++) {
      const prev = all[bn][all[bn].length - 1];

      if (columns[i]) {
        if (prev.hash === columns[i].hash) {
          prev.count++;
        } else {
          all[bn].push(columns[i]);
        }
      } else {
        if (prev.hash) {
          all[bn].push({ count: 1 });
        } else {
          prev.count++;
        }
      }
    }

    return all;
  }, {});
}

function extractEntries (all: ForkHeaders): [string, ForkHeader[]][] {
  return Object.keys(all).sort().reverse().map((bn): [string, ForkHeader[]] =>
    [bn, all[bn]]
  );
}

class Forks extends React.PureComponent<Props, State> {
  public state: State = {
    all: [],
    fin: new Map(),
    newHeads: [],
    finHeads: []
  };

  private _isPrevShort: boolean = false;

  public static getDerivedStateFromProps ({ subscribeFinalizedHeads, subscribeNewHead }: Props, prevState: State): Pick<State, any> | null {
    if (!subscribeFinalizedHeads && !subscribeNewHead) {
      return null;
    }

    // we just keep track of the finalized blocks inside a map (easy `has` access)
    if (subscribeFinalizedHeads) {
      prevState.fin.set(subscribeFinalizedHeads.hash.toHex(), true);
    }

    subscribeNewHead && prevState.newHeads.unshift(subscribeNewHead);

    const newHeads = prevState.newHeads.slice(0, Math.min(prevState.newHeads.length, MAX_HEADS));
    const all = extractEntries(flattenColumns(mapToColumns(newHeads)));

    return {
      all,
      newHeads
    };
  }

  public render (): React.ReactNode {
    const { className } = this.props;
    const { all } = this.state;

    return (
      <div className={className}>
        <table>
          <tbody>
            {all.map(this.renderEntry)}
          </tbody>
        </table>
      </div>
    );
  }

  private renderEntry = ([bn, curr]: [string, ForkHeader[]], index: number): React.ReactNode => {
    const { all } = this.state;
    const lastIndex = all.length - 1;

    // when  we are not in the first of last spot and we have the same lengths, just ellipsis the thing
    if (index !== lastIndex && index !== 0) {
      if (curr.length === all[index + 1][1].length && curr.length === all[index - 1][1].length) {
        if (this._isPrevShort) {
          return null;
        }

        this._isPrevShort = true;

        return (
          <tr key={bn}>
            <td key='blockNumber' />
            <td colSpan={curr[0].count}>…</td>
          </tr>
        );
      }
    }

    this._isPrevShort = false;

    return (
      <tr key={bn}>
        <td key='blockNumber'>#{bn}</td>
        {curr.map(this.renderCol)}
      </tr>
    );
  }

  private renderCol = (column: ForkHeader, index: number): React.ReactNode => {
    const { fin } = this.state;
    const extraClassName = column.hash
      ? (
        fin.has(column.hash)
          ? 'isFinalized'
          : ''
      )
      : 'isMissing';

    return (
      <td
        className={`block ${extraClassName}`}
        colSpan={column.count ? column.count : 1}
        key={index}
      >{
          column.hash
            ? (
              <>
                <div className='hash'>{u8aToHex(hexToU8a(column.hash), 48)}</div>
                <div className='parent'>{u8aToHex(hexToU8a(column.parent), 48)}</div>
              </>
            )
            : <div className='empty' />
        }
      </td>
    );
  }
}

export default withMulti(
  styled(Forks as React.ComponentClass<Props>)`
    table {
      font-family: monospace;

      td {
        padding: 0.25rem 0.5rem;
        text-align: center;

        .parent {
          font-size: 0.75rem;
          line-height: 0.75rem;
        }

        &.block {
          background: #f2f2f2;

          &.isFinalized {
            background: rgba(0, 255, 0, 0.15);
          }

          &.isMissing {
            background: rgba(255, 0, 0, 0.075);
          }
        }
      }
    }
  `,
  translate,
  withCalls<Props>(
    ['rpc.chain.subscribeNewHead', { propName: 'subscribeNewHead' }],
    ['rpc.chain.subscribeFinalizedHeads', { propName: 'subscribeFinalizedHeads' }]
  )
);
