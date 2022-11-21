// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';
import { SuspensionEvent } from './index';

interface Props {
  suspensions: SuspensionEvent[] | undefined,
}

function CurrentList ({ suspensions }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState<string>('');

  const headerRef = useRef(
    [
      [t('suspensions'), 'start', 1],
      [t('start era'), 'expand'],
      [t('end era'), 'expand'],
      [t('reason'), 'expand'],
      [t('stats'), 'expand']
    ]
  );

  // Work-around for BanEvents containing reserved nodes - remove when backend is fixed
  // Below are AccountIds of Testnet and Mainnet Foundation validators
  const excludedReservedValidators = [
    '5Eo5ZxVUGbT6D8cfAvAxQFhzt3ZqBEb5oE8KCWR9vjvTPSMy', '5HNnDD5djTaiUt3A6yf6f1E9oDiM5w5fcNBTLLCoMKf1TEdS',
    '5DATX2UZZgxAsumbVEsmup2q6LR9Bn81F7KW7PsShgUw8t12', '5GW5kbpuYn8Wa2253xLNLn9dZYWJUPJmW7VwmjnziDWdGxiX',
    '5Grh6bLQmoxinEeiijAfSbGYrYiKhxnxcM2m96s5A64VyAiF', '5CGTtuqDbBQokPQjpa4mQyNKyvYxKpgtZEskDkJxzho1NhbM',
    '5FnyjESMB4EBQn1W1vnNKZ5oVUYUmQbTPG4hZbJJm8697TKt', '5GN3rbR41UYWtjoxeuyvBfWEPopH4C2R4z7qhtz2ysF5hmrt',
    '5HYzfrjAMGB6zWW3oTg7dhGdWB8cawyU84fCpGar9QhupweS', '5Dkh7kuPm4NMfkmDG1LaVZVWXW3WHYwh7BKEFfNvPiGDrARH',
    '5CK2GZvpmKYxJQXMQzHa2vvHLf5cibuWK4qkcCem2p9PXYx1', '5CcZnvQmvNJviAxpnmZKVM9aYtfoyRsE4YKoTig9jWBTW8zH',
    '5CoxXHzXRZrnVkmdDhYVHz5b6PJdCRmR5yGSQmQwzasHyzaw', '5DRbk3BimLzBzQtzUYUP35c57iwXtpqyjbnfY6AX48vbGMQC',
    '5EjX1sVKuvrDAkm3XVS1xBLfboH5GqfLG9WnBwe8Pki8qwR6', '5F4P6AGQPwVUX3mwfmc64fnGd1abEV2QDKdVT3KRRw793WYK',
    '5GFCZjWGSHas86192H3yiZZFySLtUW74SdHDqTymBEDUUF7T', '5GsqnQjwhayJ1TEtv43ZYQvvvMkG2pEgucGJw39ci96R1pVp',
    '5H9h84SrX4gdXTxGyB6wtEfTye5Kb7vMcwARNLCZxMa1CruS', '5HdUiPkneLL2dQHvFkp47cfw63uPWSL8gFPzduLw6YXx3cBU'
  ];

  return (
    <Table
      empty={
        suspensions !== undefined && suspensions.length === 0 && t<string>('No suspensions events found in the past 84 eras')
      }
      emptySpinner={
        <>
          {suspensions === undefined && <div>{t<string>('Retrieving suspensions events')}</div>}
        </>
      }
      filter={
        <div className='staking--optionsBar'>
          <Filtering
            nameFilter={nameFilter}
            setNameFilter={setNameFilter}
          />
        </div>
      }
      header={headerRef.current}
    >
      {suspensions?.filter(({ address }) =>
        !excludedReservedValidators.find((value) => value === address))
        .map(({ address, era, suspensionLiftsInEra, suspensionReason }): React.ReactNode => (
          <Address
            address={address}
            era={era}
            filterName={nameFilter}
            key={address}
            suspensionLiftsInEra={suspensionLiftsInEra}
            suspensionReason={suspensionReason}
          />
        ))}
    </Table>
  );
}

export default React.memo(CurrentList);
