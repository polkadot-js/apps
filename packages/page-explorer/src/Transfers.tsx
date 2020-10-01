// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { HeaderExtended } from '@polkadot/api-derive';
import { Table } from '@polkadot/react-components';

import Transfer from './Transfer';
import { useTranslation } from './translate';

interface Props {
  headers: HeaderExtended[],
  title: string,
  hideLongFields: Boolean,
}

function Transfers ({ headers, hideLongFields = false, title = 'recent transfers' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = hideLongFields ? useRef([
    [t(title), 'start', 4],
  ]) : useRef([
    [t(title), 'start', 2],
    [t('from')],
    [t('to')],
    [t('amount'), 'expand'],
  ]);

  return (
    <Table
      empty={t<string>('No transfers available')}
      header={headerRef.current}
    >
      {headers
        .filter((header) => !!header)
        .map((header): React.ReactNode => (
          <Transfer
            key={header.number.toString()}
            value={header}
            hideLongFields={hideLongFields}
          />
        ))}
    </Table>
  );
}

export default React.memo(Transfers);
