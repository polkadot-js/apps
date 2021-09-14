// Copyright 2017-2021 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { within } from '@testing-library/react';

import { showBalance } from '../utils/balance';
import { Row } from './Row';

export class Table {
  constructor (private readonly table: HTMLElement, private readonly rowClassName: string) {
    this.table = table;
    this.rowClassName = rowClassName;
  }

  async assertRowsOrderAndColoring (order: number[]): Promise<void> {
    await this.assertRowsOrder(order);
    await this.assertColoring();
  }

  async assertRowsOrder (balancesExpectedOrder: number[]): Promise<void> {
    const orderedRows = await this.getRows();

    await Promise.all(orderedRows.map(async (row, index) => {
      const expectedBalanceTextContent = showBalance(balancesExpectedOrder[index]);

      expect(await row.getBalanceSummary()).toHaveTextContent(expectedBalanceTextContent);
    }));
  }

  async assertColoring (): Promise<void> {
    const collapsibleRows = await this.getRows();

    for (const collapsibleRow of collapsibleRows) {
      collapsibleRow.assertColoring();
    }
  }

  async getRows (): Promise<Row[]> {
    const htmlRows = await this.getFilteredHtmlRows();
    const collapsibleRows: Row[] = [];

    for (let rowIdx = 0; rowIdx < htmlRows.length; rowIdx = rowIdx + 2) {
      const primaryRow = htmlRows[rowIdx];
      const detailsRow = htmlRows[rowIdx + 1];

      collapsibleRows.push(new Row(primaryRow, detailsRow, rowIdx / 2));
    }

    return collapsibleRows;
  }

  assertColumnNotExist (columnName: string): void {
    expect(within(this.table).queryByRole('columnheader', { name: columnName })).toBeFalsy();
  }

  assertColumnExists (columnName: string): void {
    expect(within(this.table).getByRole('columnheader', { name: columnName })).toBeTruthy();
  }

  async assertText (text: string): Promise<HTMLElement> {
    return within(this.table).findByText(text);
  }

  private async getFilteredHtmlRows (): Promise<HTMLElement[]> {
    const htmlRows = await this.getAllHtmlRows();

    return htmlRows.filter((row) => row.className.startsWith(this.rowClassName));
  }

  private async getAllHtmlRows (): Promise<HTMLElement[]> {
    const tableBody = this.table.getElementsByTagName('tbody')[0];

    return within(tableBody).findAllByRole('row');
  }
}
