/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';
import { Header } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { withApi, withMulti } from '@polkadot/react-api';
import { formatNumber } from '@polkadot/util';

import translate from './translate';

const MAX_HEADS = 300;

interface Props extends ApiProps, I18nProps {
  className?: string;
  finHead?: Header;
  newHead?: Header;
}

interface ForkHeader {
  count: number;
  hash?: string;
  parent?: string;
}

type ForkHeaders = Record<string, ForkHeader[]>;

interface State {
  all: [string, ForkHeader[]][];
}

type UnsubFn = () => void;

// This is the first step - we take a bundle of headers and then convert these into
// columns based on the parent of the header
function mapToColumns (newHeads: Header[]): ForkHeaders {
  let maxColumns = 1;

  // traverse through all the headers we do have
  return newHeads.reduce((all: ForkHeaders, header, index): ForkHeaders => {
    const num = formatNumber(header.number);
    const cnum = formatNumber(header.number.unwrap().addn(1));
    const hash = header.hash.toHex();
    const parent = header.parentHash.toHex();

    // we use the hash & parent in  our display - the count is for the number
    // of columns we assign to this one - start that at 1
    const entry = { count: 1, hash, parent };

    // this is our first entry, so just add it to a column, and get out
    if (index === 0) {
      all[num] = [entry];
      maxColumns = 1;

      return all;
    }

    // if we don't have a row yet for this number, add one - this will be useful
    if (!all[num]) {
      all[num] = [];
    }

    // check our children (preceding) and add to all applicable columns
    let hasChildren = false;

    if (all[cnum]) {
      // a single header can  have multiple children, so we actually create a column
      // entry for each of the children we do find in the list
      all[cnum].forEach((child, index): void => {
        if (child.parent === hash) {
          all[num][index] = entry;
          hasChildren = true;
        }
      });
    }

    // we don't have children, so create a new column and add us to it - this goes right at
    // the end of the list since it doesn't stack on-top of anything else (yet)
    if (!hasChildren) {
      all[num][maxColumns] = entry;
      maxColumns++;
    }

    return all;
  }, {});
}

// Here we take columns that repeat and just flatten them - basically we just increase
// the count in the entry and then drop the duplicate
function flattenColumns (all: ForkHeaders): ForkHeaders {
  return Object.entries(all).reverse().reduce((all: ForkHeaders, [bn, columns]): ForkHeaders => {
    // columns may be completely empty (i.e. we didn't find a match)
    all[bn] = [columns[0] || { count: 1 }];

    // check all columns and increment the counts
    for (let i = 1; i < columns.length; i++) {
      const prev = all[bn][all[bn].length - 1];

      if (columns[i]) {
        if (prev.hash === columns[i].hash) {
          // we have a column and a hash match, so just  increment the count
          prev.count++;
        } else {
          // ahhh, this is a new one, add it as-is
          all[bn].push(columns[i]);
        }
      } else {
        if (prev.hash) {
          // add the first empty
          all[bn].push({ count: 1 });
        } else {
          // another empty one, increase the count
          prev.count++;
        }
      }
    }

    return all;
  }, {});
}

// This is a helper to take out map and return a sorted list of the key (blockNumber, formatted)
// and the actual columns that we have for that entry
function extractEntries (all: ForkHeaders): [string, ForkHeader[]][] {
  return Object.keys(all).reverse().map((bn): [string, ForkHeader[]] =>
    [bn, all[bn]]
  );
}

class Forks extends React.PureComponent<Props, State> {
  public state: State = {
    all: []
  };

  private _allFin: Map<string, boolean> = new Map();

  private _allHeads: Header[] = [];

  private _isPrevShort: boolean = false;

  private _subFinHead: UnsubFn | null = null;

  private _subNewHead: UnsubFn | null = null;

  private hasHeader (hash: Uint8Array): boolean {
    return this._allHeads.some((prev): boolean => prev.hash.eq(hash));
  }

  private addFin = (header: Header): void => {
    this._allFin.set(header.hash.toHex(), true);
  }

  private addHeader = (header: Header): void => {
    const { api } = this.props;

    if (!this.hasHeader(header.hash)) {
      // add the header to the list
      this._allHeads.unshift(header);

      // sort and trim to our maxium
      this._allHeads = this._allHeads
        .sort((a, b): number => b.number.unwrap().cmp(a.number.unwrap()))
        .slice(0, Math.min(this._allHeads.length, MAX_HEADS));

      // if we don't have the parent of this one, retrieve it
      if (!this.hasHeader(header.parentHash)) {
        // just make sure we are not first in the lsit, we don't want to full chain
        if (!this._allHeads[this._allHeads.length - 1].number.eq(header.number)) {
          console.warn(`Retrieving missing header ${header.parentHash.toHex()}`);

          api.rpc.chain.getHeader(header.parentHash).then(this.addHeader);
        }
      }

      // do the magic, extract the info into something useful and add to state
      this.setState((): State => ({
        all: extractEntries(
          flattenColumns(
            mapToColumns(this._allHeads)
          )
        )
      }));
    }
  }

  public async componentDidMount (): Promise<void> {
    const { api } = this.props;

    this._subFinHead = await api.rpc.chain.subscribeFinalizedHeads(this.addFin);
    this._subNewHead = await api.rpc.chain.subscribeNewHead(this.addHeader);
  }

  public componentWillUnmount (): void {
    if (this._subFinHead) {
      this._subFinHead();
    }

    if (this._subNewHead) {
      this._subNewHead();
    }
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
      // are the lengths matching here, if not we just want to skip
      if (curr.length === all[index + 1][1].length && curr.length === all[index - 1][1].length) {
        // now check to ensure that each entry has the same parent
        const sameParent = curr.reduce((same, hdr, index): boolean => {
          return same && ((index === 0) || (hdr.hash === curr[index - 1].hash));
        }, true);

        // cool, we are ok to shortcut
        if (sameParent) {
          // if the previous result was an ellipsis, we just don't do anything, one ellipsis only
          if (this._isPrevShort) {
            return null;
          }

          this._isPrevShort = true;

          return (
            <tr key={bn}>
              <td key='blockNumber' />
              <td colSpan={curr[0].count}>&#8942;</td>
            </tr>
          );
        }
      }
    }

    this._isPrevShort = false;

    return (
      <tr key={bn}>
        <td className='blockNumber' key='blockNumber'>#{bn}</td>
        {curr.map(this.renderCol)}
      </tr>
    );
  }

  private renderCol = (column: ForkHeader, index: number): React.ReactNode => {
    const extraClassName = column.hash
      ? (
        this._allFin.has(column.hash)
          ? 'isFinalized'
          : ''
      )
      : 'isMissing';

    return (
      <td
        className={`header ${extraClassName}`}
        colSpan={column.count ? column.count : 1}
        key={index}
      >{
          column.hash
            ? (
              <>
                <div className='hash'>{column.hash}</div>
                <div className='parent'>{column.parent}</div>
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

        div {
          margin: 0 auto;
          max-width: 7rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          &.parent {
            font-size: 0.75rem;
            line-height: 0.75rem;
            max-width: 5.25rem; /* 0.75 * 7rem */
          }
        }

        &.blockNumber {
          font-size: 1.25rem;
        }

        &.header {
          background: #f2f2f2;
          border-radius: 0.25rem;

          &.isFinalized {
            background: rgba(0, 255, 0, 0.15);
          }

          &.isMissing {
            background: rgba(255, 0, 0, 0.05);
          }
        }
      }
    }
  `,
  translate,
  withApi
);
