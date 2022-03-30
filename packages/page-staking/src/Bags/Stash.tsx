// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ListNode } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { AddressMini, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isLoading: boolean;
  list?: ListNode[];
  lower: BN;
  stashId: string;
  upper: BN;
}

interface Entry {
  canJump: boolean;
  canRebag: boolean;
  jumpCount: number;
  stashInfo: ListNode | null;
}

function findEntry (upper: BN, lower: BN, stashId: string, list: ListNode[] = []): Entry {
  const stashInfo = list.find((o) => o.stashId === stashId) || null;
  const other = (stashInfo && stashInfo.jump && list.find((o) => o.stashId === stashInfo.jump)) || null;

  return {
    canJump: !!other,
    canRebag: !!stashInfo && (
      stashInfo.bonded.gt(upper) ||
      stashInfo.bonded.lt(lower)
    ),
    jumpCount: stashInfo && other
      ? (stashInfo.index - other.index)
      : 0,
    stashInfo
  };
}

function Stash ({ className, isLoading, list, lower, stashId, upper }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { canJump, canRebag, jumpCount, stashInfo } = useMemo(
    () => findEntry(upper, lower, stashId, list),
    [list, lower, stashId, upper]
  );

  return (
    <div className={className}>
      <AddressMini
        value={stashId}
        withBonded
      />
      {stashInfo && (
        canRebag
          ? (
            <TxButton
              accountId={stashInfo.stashId}
              icon='refresh'
              isDisabled={isLoading}
              label={t<string>('Rebag')}
              params={[stashInfo.stashId]}
              tx={api.tx.bagsList.rebag}
            />
          )
          : canJump
            ? (
              <TxButton
                accountId={stashInfo.stashId}
                icon='caret-up'
                isDisabled={isLoading}
                label={t<string>('Move up {{jumpCount}}', { replace: { jumpCount } })}
                params={[stashInfo.jump]}
                tx={api.tx.bagsList.putInFrontOf}
              />
            )
            : null
      )}
    </div>
  );
}

export default React.memo(styled(Stash)`
  .ui--AddressMini {
    vertical-align: middle;
  }
`);
