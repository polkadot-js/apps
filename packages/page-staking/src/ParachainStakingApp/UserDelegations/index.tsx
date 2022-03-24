// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  ParachainStakingDelegator,
  ParachainStakingBond,
  ParachainStakingRoundInfo
} from '@polkadot/types/lookup'
import type { Option } from '@polkadot/types';

import React, { useEffect, useRef, useState } from 'react';

import { InputAddress, Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import DelegationDetails from './DelegationDetails';

interface Props {
  roundInfo?: ParachainStakingRoundInfo;
}

function UserDelegations ({ roundInfo }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [delegations, setDelegations] = useState<ParachainStakingBond[]>([]);
  const [requests, setRequests] = useState();

  const delegatorStateOption = useCall<Option<ParachainStakingDelegator>>(api.query.parachainStaking.delegatorState, [userAddress]);

  useEffect(() => {
    if (!delegatorStateOption) return;

    const delegatorState = delegatorStateOption.unwrapOr({}) as ParachainStakingDelegator;
    setDelegations(delegatorState.delegations || []);
    setRequests(delegatorState.requests?.requests.toJSON() as any);
  }, [delegatorStateOption]);

  const headerRef = useRef(
    [
      [t('collator address'), 'start'],
      [t('delegation amount'), 'media--1000'],
      [t('bond more'), 'media--1000'],
      [t('bond less'), 'media--1000'],
      [t('revoke'), 'media--1000'],
      [t('cancel request'), 'media--1000']
    ]
  );

  return (<>
    <InputAddress
      help={t<string>('The account you will use to delegate.')}
      label={t<string>('delegate from account')}
      onChange={setUserAddress}
      type='account'
    />
    {
      <Table
        header={headerRef.current}
      >
        {delegations && delegations.length
          ? (
            delegations.map((delegation): React.ReactNode => (
              <DelegationDetails
                delegation={delegation}
                key={delegation.owner.toString()}
                roundInfo={roundInfo}
                request={requests?.[delegation.owner.toString()]}
                userAddress={userAddress}
              />
            ))
          )
          : <tr>
            <td colSpan={6}>
              <div className='empty'>{t('No delegation for this address')}</div>
            </td>
          </tr>}
      </Table>
    }
  </>
  );
}

export default React.memo(UserDelegations);
