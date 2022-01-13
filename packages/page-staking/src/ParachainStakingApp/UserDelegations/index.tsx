// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';

import { Available, InputAddress, Table } from '@polkadot/react-components';
import { useLoadingDelay } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import { CollatorState, Delegation } from '../types';
import DelegationDetails from './DelegationDetails';
// import CollatorDetails, { CollatorInfo, CollatorState } from './CollatorDetails';

interface Props {
  allCollators: CollatorState[]
}

function UserDelegations ({ allCollators }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const isLoading = useLoadingDelay();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [delegations, setDelegations] = useState<Delegation[]>([]);

  const headerRef = useRef(
    [
      [t('collator address'), 'start'],
      [t('delegation amount'), 'media--1100']
    //   [t('total nominator stake'), 'media--1100'], //TODO add more, less delegation actions
    //   [t('# of nominators'), 'media--1100'],
    //   [t('own stake'), 'media--1100'],
    //   [t('min contribution'), 'media--1100']
    ]
  );

  useEffect(() => {
    console.log('useeffect');
    const _delegations: Delegation[] = [];

    allCollators.forEach((collator: CollatorState) => {
      collator.topDelegations.forEach((delegation) => {
        console.log(delegation.owner.toString(), userAddress);

        if (delegation.owner.toString() === userAddress) {
          _delegations.push({ collatorAddress: collator.id, delegationAmount: delegation.amount });
        }
      });
    });
    setDelegations(_delegations);
  }, [allCollators, userAddress]);

  return (<>
    <InputAddress
    // defaultValue={propSenderId}
      help={t<string>('The account you will send funds from.')}
      // isDisabled={!!propSenderId}
      label={t<string>('delegate from account')}
      // labelExtra={
      //   <Available
      //     label={t<string>('transferrable')}
      //     params={propSenderId || senderId}
      //   />
      // }
      onChange={setUserAddress}
      // type='account'
      type='allPlus'
    />
    {
      <Table
        header={headerRef.current}
      >
        {delegations.length > 0
          ? (
            delegations.map((delegation): React.ReactNode => (
              <DelegationDetails
                delegation={delegation}
                key={delegation.collatorAddress}
              />
            ))
          )
          : <tr>
            <td className='address'>
              {t<string>('No delegation for this address')}
            </td>
          </tr>}
      </Table>
    }
  </>
  );
}

export default React.memo(UserDelegations);
