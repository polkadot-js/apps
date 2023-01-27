// Copyright 2017-2022 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ComponentProps as Props } from '../types';

import React, { useEffect, useRef, useState } from 'react';
import type { BN } from '@polkadot/util';
import styled from 'styled-components';

import { Button, FilterInput, SummaryBox, Table } from '@polkadot/react-components';
import { useApi, useAddresses, useFavorites, useLoadingDelay, useToggle } from '@polkadot/react-hooks';

import CreateModal from '../modals/Create';
import { useTranslation } from '../translate';
import Address from './Address';
import Summary from './Summary';
import { largeNumSum } from '../../util';

type SortedAddress = { address: string; isFavorite: boolean };

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAddresses } = useAddresses();
  const [isCreateOpen, toggleCreate] = useToggle(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAddresses, setSortedAddresses] = useState<SortedAddress[] | undefined>();
  const [filterOn, setFilter] = useState<string>('');
  const [totalProposalCnt, setTotalProposalCnt] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const isLoading = useLoadingDelay();
  const api = useApi();

  const headerRef = useRef([
    [t('Supersigs'), 'start', 2],
    [t('no of members'), 'filter'],
    [t('proposals'), 'number'],
    [t('balance of members'), 'number'],
    [t('Supersiq balance'), 'balances'],
    [undefined, 'media--1400'],
    []
  ]);

  useEffect((): void => {
    setSortedAddresses(
      allAddresses
        .map((address): SortedAddress => ({ address, isFavorite: favorites.includes(address) }))
        .sort((a, b): number =>
          a.isFavorite === b.isFavorite
            ? 0
            : b.isFavorite
              ? 1
              : -1
        )
    );
   setbalance(); 
  }, [allAddresses, favorites]);

  const setbalance = async() => {
    var totalbalances:string = '';

    await Promise.all(allAddresses.map(async (address)=>{
      let balancesAll = await api.api.derive.balances?.all(address);
      let sigBalance = (balancesAll.freeBalance.add(balancesAll.reservedBalance)).toString();
      if(totalbalances.length > sigBalance.length){
        totalbalances = largeNumSum(totalbalances, sigBalance);
      }else{
        totalbalances = largeNumSum(sigBalance, totalbalances);
      }
    }))
    setTotalBalance(totalbalances);
  }


  return (
    <div className={className} style={{overflow: "auto"}}>
      {isCreateOpen && (
        <CreateModal
          onClose={toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      <Summary sigCnt={sortedAddresses} totalProposalCnt={totalProposalCnt} totalBalance={totalBalance} />
      <Table
        empty={!isLoading && sortedAddresses && t<string>('no addresses saved yet, add any existing address')}
        header={headerRef.current}
        withCollapsibleRows
      >
        {!isLoading && sortedAddresses?.map(({ address, isFavorite }): React.ReactNode => (
          <Address
            address={address}
            filter={filterOn}
            isFavorite={isFavorite}
            key={address}
            toggleFavorite={toggleFavorite}
            totalProposalCnt={totalProposalCnt}
            setTotalProposalCnt={setTotalProposalCnt}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(Overview)`
  .summary-box-contacts {
    align-items: center;
  }
`);
