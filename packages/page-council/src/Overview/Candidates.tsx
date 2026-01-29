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
}

function Candidates ({ allVotes = {}, electionsInfo, hasElections }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerCandidatesRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('candidates'), 'start', 2]
  ]);

  const headerRunnersRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('runners up'), 'start', 2]
  ]);

  return (
    <>
      <Table
        empty={electionsInfo && t('No runners up found')}
        header={headerRunnersRef.current}
        isSplit
      >
        {electionsInfo?.runnersUp.map(([accountId, balance]): React.ReactNode => (
          <Candidate
            address={accountId}
            balance={balance}
            hasElections={hasElections}
            key={accountId.toString()}
            voters={allVotes[accountId.toString()]}
          />
        ))}
      </Table>
      <Table
        empty={electionsInfo && t('No candidates found')}
        header={headerCandidatesRef.current}
        isSplit
      >
        {electionsInfo?.candidates.map((accountId): React.ReactNode => (
          <Candidate
            address={accountId}
            hasElections={false}
            key={accountId.toString()}
            voters={allVotes[accountId.toString()]}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Candidates);
