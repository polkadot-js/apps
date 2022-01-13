// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressSmall, Button, TxButton } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

export interface Delegation {
    collatorAddress:string;
    delegationAmount:string;
}

interface Props {
    delegation:Delegation
}

function DelegationDetails ({  delegation }: Props): React.ReactElement<Props> | null {
//   const { t } = useTranslation();
//   const { api } = useApi();
//   const { bond,
//     delegators,
//     topDelegations,
//     totalBacking,
//     totalCounted } = collatorDetails || { bond: new BN(0),
//     nominators: [],
//     topNominators: [],
//     totalBacking: new BN(0),
//     totalCounted: new BN(0) };
//   const minContribution = topDelegations?.length === Number(collatorInfo.maxDelegatorsPerCandidate) && topDelegations?.length > 0 ? topDelegations[topDelegations?.length - 1].amount : collatorInfo.minDelegation;
//   const [isDelegateOpen, toggleDelegate] = useToggle();

  return (
    <tr >
      <td className='address'>
        <AddressSmall value={delegation.collatorAddress} />
      </td>
      <td className='number media--1100'>
        { (
          <FormatBalance value={delegation.delegationAmount} /> // counted nominator stake //TODO: maybe we should subtract the "own stake" amount from this (also true for next variable) - see case for zero delegation
        )}
      </td>
    </tr>
  );
}

export default React.memo(DelegationDetails);
