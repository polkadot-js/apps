// Copyright 2017-2025 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Balance } from '@polkadot/types/interfaces';

import React from 'react';

import { AddressSmall, Tag } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Voters from './Voters.js';

interface Props {
  className?: string;
  address: AccountId;
  balance?: Balance;
  hasElections: boolean;
  isPrime?: boolean;
  voters?: AccountId[];
}

function Candidate ({ address, balance, className = '', hasElections, isPrime, voters }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <>
      <tr className={`${className} isExpanded isFirst ${hasElections ? '' : 'isLast'}`}>
        <td className='address all relative'>
          <AddressSmall value={address} />
          {isPrime && (
            <Tag
              className='absolute'
              color='green'
              label={t('prime')}
            />
          )}
        </td>
        <td className='number'>
          {voters && formatNumber(voters.length)}
        </td>
      </tr>
      {hasElections && (
        <Voters
          balance={balance}
          voters={voters}
        />
      )}
    </>
  );
}

export default React.memo(Candidate);
