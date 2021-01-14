// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveElectionsInfo } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Candidate from './Candidate';

interface Props {
  allVotes?: Record<string, AccountId[]>;
  className?: string;
  electionsInfo?: DeriveElectionsInfo;
  prime?: AccountId | null;
}

function Members ({ allVotes = {}, className = '', electionsInfo, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('members'), 'start', 2],
    [t('backing'), 'expand'],
    [t('votes')]
  ]);

  return (
    <Table
      className={className}
      empty={electionsInfo && t<string>('No members found')}
      header={headerRef.current}
    >
      {electionsInfo?.members.map(([accountId, balance]): React.ReactNode => (
        <Candidate
          address={accountId}
          balance={balance}
          isPrime={prime?.eq(accountId)}
          key={accountId.toString()}
          voters={allVotes[accountId.toString()]}
        />
      ))}
    </Table>
  );
}

export default React.memo(Members);
