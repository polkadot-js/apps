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
import { stringToHex } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

type SortedAddress = { address: string; isFavorite: boolean };

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  // const { allAddresses } = useAddresses();
  const [isCreateOpen, toggleCreate] = useToggle(false);
  const [favorites, toggleFavorite, setFavorites] = useFavorites(STORE_FAVS);
  const [sortedAddresses, setSortedAddresses] = useState<SortedAddress[] | undefined>();
  const [filterOn, setFilter] = useState<string>('');
  const [totalProposalCnt, setTotalProposalCnt] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState('');
  const isLoading = useLoadingDelay();
  const api = useApi();
  const [allAddresses, setAllAddresses] = useState<string[]>([]);

  const headerRef = useRef([
    [t('Supersigs'), 'start', 2],
    [t('no of members'), 'filter'],
    [t('proposals'), 'number'],
    [t('balance of members'), 'number'],
    [undefined, 'media--1500'],
    [t('Supersiq balance'), 'balances'],
    [undefined, 'media--1400', 2],
    []
  ]);

  useEffect((): void => {
    getSuperSigAddress();
  }, []);

  
  useEffect((): void => {
    setSortedAddresses(
      allAddresses
        .map((address:any): SortedAddress => ({ address, isFavorite: favorites.includes(address) }))
        .sort((a:any, b:any): number =>
          a.isFavorite === b.isFavorite
            ? 0
            : b.isFavorite
              ? 1
              : -1
        )
    );
   setbalance(); 
  }, [allAddresses, favorites]);


  const getSuperSigAddress = async() => {
    let modl = '0x6d6f646c'
    let pallet_id = await api.api.consts.supersig.palletId.toString();
    let supersig_nonce = await api.api.query.supersig.nonceSupersig();
    let addressArray: string[] = [];

    const twoDigit = (number: number): string => {
      var twodigit = number >= 10 ? number : "0"+number.toString();
      return twodigit.toString();
    }

    async function* asyncGenerator() {
      let i = 0;
      while (i < Number(supersig_nonce)) {
        yield i++;
      }
    }

    for await (const num of asyncGenerator()) {
      let supersig_concat = ( modl + pallet_id.slice(2, pallet_id.length) + twoDigit(num) + '00000000000000000000000000000000000000' );
      var account = encodeAddress(supersig_concat);
      try{
        let members: any[] = await (await api.api.rpc.superSig.listMembers(account)).toArray();
        if(members.length > 0){
          addressArray.push(account.toString());
        }
      }catch(err){}
    }
    setFavorites([addressArray[addressArray.length - 1]]);
    setAllAddresses(addressArray);
  }

  const setbalance = async() => {
    var totalbalances:string = '';
    var totalproposal:number = 0;

    await Promise.all(allAddresses.map(async (address)=>{
      let balancesAll = await api.api.derive.balances?.all(address);
      let sigBalance = (balancesAll.freeBalance.add(balancesAll.reservedBalance)).toString();
      if(totalbalances.length > sigBalance.length){
        totalbalances = largeNumSum(totalbalances, sigBalance);
      }else{
        totalbalances = largeNumSum(sigBalance, totalbalances);
      }
      let proposals = await api.api.rpc.superSig.listProposals(address);
      totalproposal = totalproposal + proposals.proposals_info.length;
    }))
    setTotalProposalCnt(totalproposal);
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
      <Summary sigCnt={sortedAddresses} totalProposals={totalProposalCnt} totalBalance={totalBalance} />
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
