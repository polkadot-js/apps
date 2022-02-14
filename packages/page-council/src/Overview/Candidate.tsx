// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Balance } from '@polkadot/types/interfaces';

import React from 'react';

import { AddressSmall, Tag } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Voters from './Voters';

interface Props {
  className?: string;
  address: AccountId;
  balance?: Balance;
  isPrime?: boolean;
  voters?: AccountId[];
}

function Candidate ({ address, balance, className = '', isPrime, voters }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      <td>
        {isPrime && (
          <Tag
            color='green'
            hover={t<string>('Current prime member, default voting')}
            label={t<string>('prime voter')}
          />
        )}
      </td>
      <Voters
        balance={balance}
        voters={voters}
      />
    </tr>
  );
}

export default React.memo(Candidate);
