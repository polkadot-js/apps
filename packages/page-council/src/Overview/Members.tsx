// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { ComponentProps } from './types';

import React, { useMemo } from 'react';
import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Candidate from './Candidate';

interface Props extends ComponentProps {
  allVotes?: Record<string, AccountId[]>;
  className?: string;
  prime?: AccountId | null;
}

function Members ({ allVotes = {}, className, electionsInfo, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo(() => [
    [t('members'), 'start', 2],
    [t('backing')]
  ], [t]);

  return (
    <Table
      className={className}
      empty={electionsInfo && t('No members found')}
      header={header}
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
