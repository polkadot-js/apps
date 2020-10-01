// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { HeaderExtended } from '@polkadot/api-derive';
import { Table } from '@polkadot/react-components';

import SimpleAccount from './Account';
import Account from '@polkadot/app-accounts/Accounts/Account';
import { useTranslation } from './translate';

interface Props {
  headers: HeaderExtended[],
  title: string,
  tableHeaders?: array,
}

function Accounts ({ headers, tableHeaders, useComplex = true, title = 'accounts' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef(tableHeaders || [
    [t(title), 'start', 3]
  ]);

  function setBalance() {

  }

  return (
    <Table
      empty={t<string>('No accounts available')}
      header={headerRef.current}
    >
      {headers
        .filter((header) => !!header)
        .map((header): React.ReactNode => useComplex ? (
          <Account
            account={{
              address: header.account,
              meta: {
              }
            }}
            isFavorite={false}
            filter={[]}
            key={header.account}
            setBalance={setBalance}
            transferFromSelf={true}
          />
        ) : (
          <SimpleAccount
            key={header.account.toString()}
            value={header}
          />
        ))}
    </Table>
  );
}

export default React.memo(Accounts);
