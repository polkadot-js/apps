// Copyright 2017-2025 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveElectionsInfo } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Candidate from './Candidate.js';

interface Props {
  allVotes?: Record<string, AccountId[]>;
  className?: string;
  electionsInfo?: DeriveElectionsInfo;
  hasElections: boolean;
  prime?: AccountId | null;
}

function Members ({ allVotes = {}, className = '', electionsInfo, hasElections, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('members'), 'start', 2]
  ]);

  return (
    <Table
      className={className}
      empty={electionsInfo && t('No members found')}
      header={headerRef.current}
      isSplit
    >
      {electionsInfo?.members.map(([accountId, balance]): React.ReactNode => (
        <Candidate
          address={accountId}
          balance={balance}
          hasElections={hasElections}
          isPrime={prime?.eq(accountId)}
          key={accountId.toString()}
          voters={allVotes[accountId.toString()]}
        />
      ))}
    </Table>
  );
}

export default React.memo(Members);
