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
import { CardSummary, IdentityIcon, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import translate from './translate';

interface LinkHeader {
  author: string | null;
  bn: string;
  hash: string;
  height: number;
  isEmpty: boolean;
  isFinalized: boolean;
  parent: string;
  width: number;
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
  numBlocks: number;
  numForks: number;
  tree?: Link;
}

type UnsubFn = () => void;

interface Col {
  author: string | null;
  hash: string;
  isEmpty: boolean;
  isFinalized: boolean;
  parent: string;
  width: number;
}

interface Row {
  bn: string;
  cols: Col[];
}

// adjust the number of columns in a cell based on the children and tree depth
function calcWidth (children: LinkArray): number {
  return Math.max(1, children.reduce((total, { hdr: { width } }): number => {
    return total + width;
  }, 0));
}

// counts the height of a specific node
function calcHeight (children: LinkArray): number {
  return children.reduce((max, { hdr, arr }): number => {
    hdr.height = hdr.isEmpty
      ? 0
      : 1 + calcHeight(arr);

    return Math.max(max, hdr.height);
  }, 0);
}

// a single column in a row, it just has the details for the entry
function createCol ({ hdr: { author, hash, isEmpty, isFinalized, parent, width } }: Link): Col {
  return { author, hash, isEmpty, isFinalized, parent, width };
}

// create a simplified structure that allows for easy rendering
function createRows (arr: LinkArray): Row[] {
  if (!arr.length) {
    return [];
  }

  return createRows(
    arr.reduce((children: LinkArray, { arr }: Link): LinkArray =>
      children.concat(...arr), [])
  ).concat({
    bn: arr.reduce((result, { hdr: { bn } }): string =>
      result || bn, ''),
    cols: arr.map(createCol)
  });
}

// fills in a header based on the supplied data
function createHdr (bn: string, hash: string, parent: string, author: string | null, isEmpty = false): LinkHeader {
  return { author, bn, hash, height: 0, isEmpty, isFinalized: false, parent, width: 0 };
}

// empty link helper
function createLink (): Link {
  return {
    arr: [],
    hdr: createHdr('', ' ', ' ', null, true)
  };
}

// even out the columns, i.e. add empty spacers as applicable to get tree rendering right
function addColumnSpacers (arr: LinkArray): void {
  // check is any of the children has a non-empty set
  const hasChildren = arr.some(({ arr }): boolean => arr.length !== 0);

  if (hasChildren) {
    // ok, non-empty found - iterate through an add at least an empty cell to all
    arr
      .filter(({ arr }): boolean => arr.length === 0)
      .forEach(({ arr }): number => arr.push(createLink()));

    const newArr = arr.reduce((flat: LinkArray, { arr }): LinkArray => flat.concat(...arr), []);

    // go one level deeper, ensure that the full tree has empty spacers
    addColumnSpacers(newArr);
  }
}

// checks to see if a row has a single non-empty entry, i.e. it is a candidate for collapsing
function isSingleRow (cols: Col[]): boolean {
  if (!cols[0] || cols[0].isEmpty) {
    return false;
  }

  return cols.reduce((result: boolean, col, index): boolean => {
    return index === 0
      ? result
      : (!col.isEmpty ? false : result);
  }, true);
}

function renderCol ({ author, hash, isEmpty, isFinalized, parent, width }: Col, index: number): React.ReactNode {
  return (
    <td
      className={`header ${isEmpty && 'isEmpty'} ${isFinalized && 'isFinalized'}`}
      colSpan={width}
      key={`${hash}:${index}:${width}`}
    >
      {
        isEmpty
          ? <div className='empty' />
          : (
            <>
              {author && (
                <IdentityIcon
                  className='author'
                  size={28}
                  value={author}
                />
              )}
              <div className='contents'>
                <div className='hash'>{hash}</div>
                <div className='parent'>{parent}</div>
              </div>
            </>
          )
      }
    </td>
  );
}

// render the rows created by createRows to React nodes
function renderRows (rows: Row[]): React.ReactNode[] {
  const lastIndex = rows.length - 1;
  let isPrevShort = false;

  return rows.map(({ bn, cols }, index): React.ReactNode => {
    // if not first, not last and single only, see if we can collapse
    if (index !== 0 && index !== lastIndex && isSingleRow(cols)) {
      if (isPrevShort) {
        // previous one was already a link, this one as well - skip it
        return null;
      } else if (isSingleRow(rows[index - 1].cols)) {
        isPrevShort = true;

        return (
          <tr key={bn}>
            <td key='blockNumber' />
            <td className='header isLink' colSpan={cols[0].width}>
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
        {cols.map(renderCol)}
      </tr>
    );
  });
}

class Forks extends React.PureComponent<Props, State> {
  public state: State = {
    numBlocks: 0,
    numForks: 0
  };

  private _children: Map<string, string[]> = new Map([['root', []]]);

  private _headers: Map<string, LinkHeader> = new Map();

  private _firstNum = '';

  private _subFinHead: UnsubFn | null = null;

  private _subNewHead: UnsubFn | null = null;

  // mark as finalized, working down for parents as well
  private finalize (hash: string): void {
    const hdr = this._headers.get(hash);

    if (hdr && !hdr.isFinalized) {
      hdr.isFinalized = true;

      this.finalize(hdr.parent);
    }
  }

  // callback for the subscribe finalized sub
  private addFinalized = (header: Header): void => {
    this.finalize(header.hash.toHex());
  }

  // callback for the subscribe headers sub
  private addHeader = (header: Header): void => {
    const { api } = this.props;

    // formatted block info
    const bn = formatNumber(header.number);
    const hash = header.hash.toHex();
    const parent = header.parentHash.toHex();
    let isFork = false;

    // if this the first one?
    if (!this._firstNum) {
      this._firstNum = bn;
    }

    if (!this._headers.has(hash)) {
      // if this is the first, add to the root entry
      if (this._firstNum === bn) {
        (this._children.get('root') as any[]).push(hash);
      }

      // add to the header map
      // also for HeaderExtended header.author ? header.author.toString() : null
      this._headers.set(hash, createHdr(bn, hash, parent, null));

      // check to see if the children already has a entry
      if (this._children.has(parent)) {
        isFork = true;
        (this._children.get(parent) as any[]).push(hash);
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
      this.setState(({ numBlocks, numForks }): State => ({
        numBlocks: numBlocks + 1,
        numForks: numForks + (isFork ? 1 : 0),
        tree: this.generateTree()
      }));
    }
  }

  // on mount, create the subscriptions for heads & finalized
  public async componentDidMount (): Promise<void> {
    const { api } = this.props;

    this._subFinHead = await api.rpc.chain.subscribeFinalizedHeads(this.addFinalized);
    this._subNewHead = await api.rpc.chain.subscribeNewHeads(this.addHeader);
  }

  // unsubscribe when we are unmounting
  public componentWillUnmount (): void {
    if (this._subFinHead) {
      this._subFinHead();
    }

    if (this._subNewHead) {
      this._subNewHead();
    }
  }

  // render the acual component
  public render (): React.ReactNode {
    const { className, t } = this.props;
    const { numBlocks, numForks, tree } = this.state;

    if (!tree) {
      return null;
    }

    return (
      <div className={className}>
        <SummaryBox>
          <section>
            <CardSummary label={t('blocks')}>{formatNumber(numBlocks)}</CardSummary>
            <CardSummary label={t('forks')}>{formatNumber(numForks)}</CardSummary>
          </section>
        </SummaryBox>
        <table>
          <tbody>
            {renderRows(createRows(tree.arr))}
          </tbody>
        </table>
      </div>
    );
  }

  // adds children for a specific header, retrieving based on matching parent
  private addChildren (base: LinkHeader, children: LinkArray): LinkArray {
    const hdrs = (this._children.get(base.hash) || [])
      .map((hash): LinkHeader | null => this._headers.get(hash) || null)
      .filter((hdr): boolean => !!hdr) as LinkHeader[];

    hdrs.forEach((hdr): void => {
      children.push({ arr: this.addChildren(hdr, []), hdr });
    });

    // caclulate the max height/width for this entry
    base.height = calcHeight(children);
    base.width = calcWidth(children);

    // place the active (larger, finalized) columns first for the pyramid display
    children.sort((a, b): number => {
      if (a.hdr.width > b.hdr.width || a.hdr.height > b.hdr.height || a.hdr.isFinalized) {
        return -1;
      } else if (a.hdr.width < b.hdr.width || a.hdr.height < b.hdr.height || b.hdr.isFinalized) {
        return 1;
      }

      return 0;
    });

    return children;
  }

  // create a tree list from the available headers
  private generateTree (): Link {
    const root = createLink();

    // add all the root entries first, we iterate from these
    // We add the root entry explicitly, it exists as per init
    (this._children.get('root') as string[]).forEach((hash): void => {
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

    // align the columns with empty spacers - this aids in display
    addColumnSpacers(root.arr);

    root.hdr.height = calcHeight(root.arr);
    root.hdr.width = calcWidth(root.arr);

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

      /* tr {
        opacity: 0.05;

        &:nth-child(1) { opacity: 1; }
        &:nth-child(2) { opacity: 0.95; }
        &:nth-child(3) { opacity: 0.9; }
        &:nth-child(4) { opacity: 0.85; }
        &:nth-child(5) { opacity: 0.8; }
        &:nth-child(6) { opacity: 0.75; }
        &:nth-child(7) { opacity: 0.70; }
        &:nth-child(8) { opacity: 0.65; }
        &:nth-child(9) { opacity: 0.6; }
        &:nth-child(10) { opacity: 0.55; }
        &:nth-child(11) { opacity: 0.6; }
        &:nth-child(12) { opacity: 0.55; }
        &:nth-child(13) { opacity: 0.5; }
        &:nth-child(14) { opacity: 0.45; }
        &:nth-child(15) { opacity: 0.4; }
        &:nth-child(16) { opacity: 0.35; }
        &:nth-child(17) { opacity: 0.3; }
        &:nth-child(18) { opacity: 0.25; }
        &:nth-child(19) { opacity: 0.2; }
        &:nth-child(20) { opacity: 0.15; }
        &:nth-child(21) { opacity: 0.1; }
      } */

      td {
        padding: 0.25rem 0.5rem;
        text-align: center;

        .author,
        .contents {
          display: inline-block;
          vertical-align: middle;
        }

        .author {
          margin-right: 0.25rem;
        }

        .contents {
          .hash, .parent {
            margin: 0 auto;
            max-width: 6rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .parent {
            font-size: 0.75rem;
            line-height: 0.75rem;
            max-width: 4.5rem;
          }
        }

        &.blockNumber {
          font-size: 1.25rem;
        }

        &.header {
          background: #f5f5f5;
          border: 1px solid #eee;
          border-radius: 0.25rem;

          &.isEmpty {
            background: transparent;
            border-color: transparent;
          }

          &.isFinalized {
            background: rgba(0, 255, 0, 0.1);
            border-color: rgba(0, 255, 0, 0.17);
          }

          &.isLink {
            background: transparent;
            border-color: transparent;
            line-height: 1rem;
            padding: 0;
          }

          &.isMissing {
            background: rgba(255, 0, 0, 0.05);
            border-color: rgba(255, 0, 0, 0.06);
          }
        }
      }
    }
  `,
  translate,
  withApi
);
