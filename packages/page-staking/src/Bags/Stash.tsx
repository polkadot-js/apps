// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ListNode } from './types';

import React, { useMemo } from 'react';

import { AddressMini, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  list?: ListNode[];
  stashId: string;
  updateTrigger: () => void;
}

function findEntry (stashId: string, list: ListNode[] = []): ListNode | null {
  return list.find((o) => o.stashId === stashId) || null;
}

export default function Stash ({ list, stashId, updateTrigger }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const stashInfo = useMemo(
    () => findEntry(stashId, list),
    [list, stashId]
  );

  return (
    <div>
      <AddressMini
        value={stashId}
        withBonded
      />
      {stashInfo && stashInfo.jump && (
        <TxButton
          accountId={stashInfo?.stashId}
          icon='caret-up'
          label={t<string>('Jump')}
          onSuccess={updateTrigger}
          params={[stashInfo?.jump]}
          tx={api.tx.bagsList.putInFrontOf}
        />
      )}
    </div>
  );
}
