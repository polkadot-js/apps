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

const MAX_HEADS = 150;

interface Props extends ApiProps, I18nProps {
  className?: string;
  subscribeFinalizedHeads?: Header;
  subscribeNewHead?: Header;
}

interface ForkHeader {
  hash: string;
  header: Header;
  isFinalized: boolean;
}

type ForkHeaders = Record<string, ForkHeader[]>;

interface State {
  all: ForkHeaders;
  finHeads: Header[];
  newHeads: Header[];
}

function mapToColumns (newHeads: Header[]): ForkHeaders {
  return newHeads.reduce((all: ForkHeaders, header, index): ForkHeaders => {
    const num = formatNumber(header.number);
    const hash = header.hash.toHex();
    const parent = header.parentHash.toHex();

    // this is our first entry, so just add it to a column, get out
    if (index === 0) {
      all[num] = [{ hash, header, isFinalized: false }];
    } else {
      if (!all[num]) {
        all[num] = [];
      }

      const bns = Object.values(all);
      const maxCols = bns.reduce((maxCols, columns): number =>
        Math.max(maxCols, columns.length), 0
      );
      let column = -1;

      for (let row = bns.length - 1; column === -1 && row >= 0; row--) {
        bns[row].forEach((entry, index): void => {
          if (parent === entry.hash) {
            column = index;
          }
        });
      }

      if (!all[num].length || all[num][0].hash !== hash) {
        all[num][column === -1 ? maxCols : column] = { hash, header, isFinalized: false };
      }
    }

    return all;
  }, {});
}

function markFinalized (all: ForkHeaders, finHeads: Header[]): void {
  finHeads.forEach((header): void => {
    const hash = header.hash.toHex();

    Object.values(all).forEach((columns): void => {
      columns.forEach((column): void => {
        if (column.hash === hash) {
          column.isFinalized = true;
        }
      });
    });
  });
}

class Forks extends React.PureComponent<Props, State> {
  public state: State = {
    all: {},
    newHeads: [],
    finHeads: []
  };

  public static getDerivedStateFromProps ({ subscribeFinalizedHeads, subscribeNewHead }: Props, prevState: State): Pick<State, any> | null {
    if (!subscribeFinalizedHeads && !subscribeNewHead) {
      return null;
    }

    subscribeFinalizedHeads && prevState.finHeads.push(subscribeFinalizedHeads);
    subscribeNewHead && prevState.newHeads.push(subscribeNewHead);

    const finHeads = prevState.finHeads.slice(0, Math.min(prevState.finHeads.length, MAX_HEADS));
    const newHeads = prevState.newHeads.slice(0, Math.min(prevState.newHeads.length, MAX_HEADS));
    const all = mapToColumns(newHeads);

    markFinalized(all, finHeads);

    return {
      all,
      finHeads,
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
            {Object.entries(all).reverse().map(([bn, columns]): React.ReactNode => (
              <tr key={bn}>
                <td key='blockNumber'>{bn}</td>
                {columns.map((column, index): React.ReactNode => (
                  <td key={index} className={column && column.isFinalized ? 'isFinalized' : ''}>{
                    column
                      ? u8aToHex(hexToU8a(column.hash), 64)
                      : ' '
                  }</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default withMulti(
  styled(Forks as React.ComponentClass<Props>)`
    table {
      font-family: monospace;

      td {
        margin: 0.25rem 0.5rem;
        padding: 0.25rem 0.5rem;
      }

      td.isFinalized {
        background: rgba(0, 255, 0, 0.25);
      }
    }
  `,
  translate,
  withCalls<Props>(
    ['rpc.chain.subscribeNewHead', { propName: 'subscribeNewHead' }],
    ['rpc.chain.subscribeFinalizedHeads', { propName: 'subscribeFinalizedHeads' }]
  )
);
