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

interface LinkHeader {
  bn: string;
  cols: number;
  hash: string;
  isEmpty: boolean;
  isFinalized: boolean;
  parent: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LinkArray extends Array<Link> {}
interface Link {
  arr: LinkArray;
  hdr: LinkHeader;
}

interface Props extends ApiProps, I18nProps {
  className?: string;
  finHead?: Header;
  newHead?: Header;
}

interface State {
  tree?: Link;
}

type UnsubFn = () => void;

interface Col {
  cols: number;
  hash: string;
  isEmpty: boolean;
  isFinalized: boolean;
  parent: string;
}

interface Row {
  bn: string;
  cols: Col[];
}

class Forks extends React.PureComponent<Props, State> {
  public state: State = {};

  private _children: Map<string, string[]> = new Map([['root', []]]);

  private _headers: Map<string, LinkHeader> = new Map();

  private _firstNum: string = '';

  private _subFinHead: UnsubFn | null = null;

  private _subNewHead: UnsubFn | null = null;

  private finalize (hash: string): void {
    const hdr = this._headers.get(hash);

    if (hdr && !hdr.isFinalized) {
      hdr.isFinalized = true;

      this.finalize(hdr.parent);
    }
  }

  private addFin = (header: Header): void => {
    this.finalize(header.hash.toHex());
  }

  private addHeader = (header: Header): void => {
    const { api } = this.props;

    // formatted block info
    const bn = formatNumber(header.number);
    const hash = header.hash.toHex();
    const parent = header.parentHash.toHex();

    // if this the first one?
    if (!this._firstNum) {
      this._firstNum = bn;
    }

    if (!this._headers.has(hash)) {
      // if this is the first, add to the root entry
      if (this._firstNum === bn) {
        // @ts-ignore root will always exist
        this._children.get('root').push(hash);
      }

      // add to the header map
      this._headers.set(hash, { bn, cols: 0, hash, isEmpty: false, isFinalized: false, parent });

      // check to see if the children already has a entry
      if (this._children.has(parent)) {
        // @ts-ignore, we just checked for existence above
        this._children.get(parent).push(hash);
      } else {
        this._children.set(parent, [hash]);
      }

      // if we don't have the parent of this one, retrieve it
      if (!this._headers.has(parent)) {
        // just make sure we are not first in the list, we don't want to full chain
        if (this._firstNum !== bn) {
          console.warn(`Retrieving missing header ${header.parentHash.toHex()}`);

          api.rpc.chain.getHeader(header.parentHash).then(this.addHeader);

          // catch the refresh on the result
          return;
        }
      }

      // do the magic, extract the info into something useful and add to state
      this.setState((): State => ({
        tree: this.generateTree()
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
    const { tree } = this.state;

    if (!tree) {
      return null;
    }

    return (
      <div className={className}>
        <table>
          <tbody>
            {this.renderRows(this.createRows(tree.arr))}
          </tbody>
        </table>
      </div>
    );
  }

  private createRows (arr: LinkArray): Row[] {
    if (!arr.length) {
      return [];
    }

    return this
      .createRows(
        arr.reduce((children: LinkArray, { arr }: Link): LinkArray =>
          children.concat(...arr),
        [])
      )
      .concat({
        bn: arr.reduce((result, { hdr: { bn } }): string =>
          result || bn
        , ''),
        cols: arr.map(this.createCol)
      });
  }

  private createCol = ({ hdr: { cols, hash, isEmpty, isFinalized, parent } }: Link): Col => {
    return { cols, hash, isEmpty, isFinalized, parent };
  }

  private isSingleRow (cols: Col[]): boolean {
    if (!cols[0]) {
      return false;
    } else if (cols[0].isEmpty) {
      return false;
    } else if (cols.length === 1) {
      return true;
    }

    return cols.reduce((result: boolean, col, index): boolean => {
      return index === 0
        ? result
        : (!col.isEmpty ? false : result);
    }, true);
  }

  private renderRows (rows: Row[]): React.ReactNode[] {
    const lastIndex = rows.length - 1;
    let isPrevShort = false;

    return rows.map(({ bn, cols }, index): React.ReactNode => {
      if (index !== 0 && index !== lastIndex && this.isSingleRow(cols)) {
        if (isPrevShort) {
          return null;
        } else if (this.isSingleRow(rows[index - 1].cols)) { // && this.isSingleRow(rows[index + 1].cols)) {
          isPrevShort = true;

          return (
            <tr key={bn}>
              <td key='blockNumber' />
              <td className='header isLink' colSpan={cols[0].cols}>
                <div className='link'>&#8942;</div>
              </td>
            </tr>
          );
        }
      }

      isPrevShort = false;

      return (
        <tr key={bn}>
          <td key='blockNumber'>{`#${bn}`}</td>
          {cols.map(this.renderCol)}
        </tr>
      );
    });
  }

  private renderCol = ({ cols, hash, isEmpty, isFinalized, parent }: Col, index: number): React.ReactNode => {
    const isLink = false;
    const classes = ['header', isEmpty && 'isEmpty', isFinalized && 'isFinalized', isLink && 'isLink'];

    return (
      <td
        className={classes.join(' ')}
        colSpan={cols}
        key={`${classes.join(':')}:${hash}:${index}:${cols}`}
      >
        {
          isLink
            ? <div className='link'>&#8942;</div>
            : isEmpty
              ? <div className='empty' />
              : (
                <>
                  <div className='hash'>{hash}</div>
                  <div className='parent'>{parent}</div>
                </>
              )
        }
      </td>
    );
  }

  private generateTree (): Link {
    return this.mapToLink();
  }

  private countCols (children: LinkArray): number {
    return Math.max(1, children.reduce((total, { hdr: { cols } }): number => {
      return total + cols;
    }, 0));
  }

  private emptyHdr (): LinkHeader {
    return { bn: '', cols: 0, hash: ' ', isEmpty: true, isFinalized: false, parent: ' ' };
  }

  private emptyLink (): Link {
    return { arr: [], hdr: this.emptyHdr() };
  }

  private addChildren (base: LinkHeader, children: LinkArray): LinkArray {
    const hdrs = (this._children.get(base.hash) || [])
      .map((hash): LinkHeader | null => this._headers.get(hash) || null)
      .filter((hdr): boolean => !!hdr) as LinkHeader[];

    hdrs.forEach((hdr): void => {
      children.push({ arr: this.addChildren(hdr, []), hdr });
    });

    children.sort((a, b): number => {
      if (a.hdr.cols > b.hdr.cols || a.hdr.isFinalized) {
        return -1;
      } else if (a.hdr.cols < b.hdr.cols || b.hdr.isFinalized) {
        return 1;
      }

      return 0;
    });

    base.cols = this.countCols(children);

    return children;
  }

  // even out the columns, i.e. add empty spacers as applicable to get tree rendering right
  private addColumnSpacers (arr: LinkArray): void {
    // check is any of the children has a non-empty set
    const hasChildren = arr.some(({ arr }): boolean => arr.length !== 0);

    if (hasChildren) {
      // ok, non-empty found - iterate through an add at least an empty cell to all
      arr
        .filter(({ arr }): boolean => arr.length === 0)
        .forEach(({ arr }): number => arr.push(this.emptyLink()));

      const newArr = arr.reduce((flat: LinkArray, { arr }): LinkArray => flat.concat(...arr), []);

      // go one level deeper, ensure that the full tree has empty spacers
      this.addColumnSpacers(newArr);
    }
  }

  // create a linked list for the available headers
  private mapToLink (): Link {
    const root = this.emptyLink();

    // add all the root entries first, we iterate from these
    // @ts-ignore We add the root entry explicitly, it exists as per init
    this._children.get('root').forEach((hash): void => {
      const hdr = this._headers.get(hash);

      // if this fails, well, we have a bigger issue :(
      if (hdr) {
        root.arr.push({ arr: [], hdr: { ...hdr } });
      }
    });

    // iterate through, adding the children for each of the root nodes
    root.arr.forEach(({ arr, hdr }): void => {
      this.addChildren(hdr, arr);
    });

    // align the columns with empty spacers and add joins - this aids in display
    this.addColumnSpacers(root.arr);

    root.hdr.cols = this.countCols(root.arr);

    return root;
  }
}

export default withMulti(
  styled(Forks as React.ComponentClass<Props>)`
    margin-bottom: 1.5rem;

    table {
      border-collapse: separate;
      border-spacing: 0.25rem;
      font-family: monospace;

      td {
        padding: 0.25rem 0.5rem;
        text-align: center;

        div {
          margin: 0 auto;
          max-width: 6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          &.parent {
            /* display: none; */
            font-size: 0.75rem;
            line-height: 0.75rem;
            max-width: 4.5rem; /* 0.75 * 7rem */
          }
        }

        &.blockNumber {
          font-size: 1.25rem;
        }

        &.header {
          background: #f2f2f2;
          border-radius: 0.25rem;

          &.isEmpty {
            background: transparent;
          }

          &.isFinalized {
            background: rgba(0, 255, 0, 0.15);
          }

          &.isLink {
            background: transparent;
            line-height: 1rem;
            margin: -0.25rem 0;
            padding: 0;
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
