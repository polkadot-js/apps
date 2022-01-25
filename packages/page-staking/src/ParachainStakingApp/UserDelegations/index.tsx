// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';

import { InputAddress, Table } from '@polkadot/react-components';
import { BN } from '@polkadot/util';

import { useTranslation } from '../../translate';
import { CollatorState, Delegation } from '../types';
import DelegationDetails from './DelegationDetails';

interface Props {
  allCollators: CollatorState[]
  roundDuration: BN
}

function UserDelegations ({ allCollators, roundDuration }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [delegations, setDelegations] = useState<Delegation[]>([]);

  const headerRef = useRef(
    [
      [t('collator address'), 'start'],
      [t('delegation amount'), 'media--1100'],
      [t('bond more'), 'media--1100'],
      [t('bond less'), 'media--1100'],
      [t('undelegate'), 'media--1100']
    ]
  );

  useEffect(() => {
    const _delegations: Delegation[] = [];

    allCollators.forEach((collator: CollatorState) => {
      collator.topDelegations.forEach((delegation) => {
        if (delegation.owner.toString() === userAddress) {
          _delegations.push({ collatorAddress: collator.id, delegationAmount: delegation.amount });
        }
      });
    });
    setDelegations(_delegations);
  }, [allCollators, userAddress]);

  return (<>
    <InputAddress
      help={t<string>('The account you will send funds from.')}
      label={t<string>('delegate from account')}
      onChange={setUserAddress}
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
                roundDuration={roundDuration}
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
