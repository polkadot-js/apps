// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Suspension from './Suspension';

interface Props {
  className?: string;
}

const optExtract = {
  transform: (keys: StorageKey<[AccountId]>[]): AccountId[] =>
    keys
      .map(({ args: [accountId] }) => accountId)
      .filter((a) => !!a)
};

function Suspended ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const candidates = useCall<AccountId[]>(api.query.society.suspendedCandidates.keys, undefined, optExtract);
  const members = useCall<AccountId[]>(api.query.society.suspendedMembers.keys, undefined, optExtract);

  const headerRefC = useRef([
    [t('candidates'), 'start']
  ]);

  const headerRefM = useRef([
    [t('members'), 'start']
  ]);

  console.log(JSON.stringify({ candidates, members }, null, 2));

  return (
    <div className={className}>
      <Table
        className={className}
        empty={members && t<string>('No suspended members')}
        header={headerRefM.current}
      >
        {members && members.map((accountId): React.ReactNode => (
          <Suspension
            key={accountId.toString()}
            value={accountId}
          />
        ))}
      </Table>
      <Table
        className={className}
        empty={candidates && t<string>('No suspended candidates')}
        header={headerRefC.current}
      >
        {candidates && candidates.map((accountId): React.ReactNode => (
          <Suspension
            key={accountId.toString()}
            value={accountId}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Suspended);
