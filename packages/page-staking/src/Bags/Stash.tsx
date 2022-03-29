// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ListNode } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { AddressMini, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  doRefresh: () => void;
  list?: ListNode[];
  stashId: string;
}

function findEntry (stashId: string, list: ListNode[] = []): [ListNode | null, boolean, number] {
  const entry = list.find((o) => o.stashId === stashId) || null;
  const other = (entry && entry.jump && list.find((o) => o.stashId === entry.jump)) || null;

  return [entry, !!other, entry && other ? entry.index - other.index : 0];
}

function Stash ({ className, doRefresh, list, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [stashInfo, canJump, jumpCount] = useMemo(
    () => findEntry(stashId, list),
    [list, stashId]
  );

  return (
    <div className={className}>
      <AddressMini
        value={stashId}
        withBonded
      />
      <TxButton
        accountId={stashInfo?.stashId}
        icon='caret-up'
        isDisabled={!canJump}
        label={t<string>('Move up {{jumpCount}}', { replace: { jumpCount } })}
        onSuccess={doRefresh}
        params={[stashInfo?.jump]}
        tx={api.tx.bagsList.putInFrontOf}
      />
    </div>
  );
}

export default styled(Stash)`
  .ui--AddressMini {
    vertical-align: middle;
  }

  .ui--Button.isDisabled {
    cursor: default;
    opacity: 0;
  }
`;
