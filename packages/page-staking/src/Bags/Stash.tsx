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
  bagLower: BN;
  bagUpper: BN;
  className?: string;
  isLoading: boolean;
  list?: ListNode[];
  stashId: string;
}

interface Entry {
  canJump: boolean;
  jumpCount: number;
  stashInfo: ListNode | null;
}

function findEntry (upper: BN, bagLower: BN, stashId: string, list: ListNode[] = []): Entry {
  const stashInfo = list.find((o) => o.stashId === stashId) || null;
  const other = (stashInfo && stashInfo.jump && list.find((o) => o.stashId === stashInfo.jump)) || null;

  return {
    canJump: !!other,
    jumpCount: stashInfo && other
      ? (stashInfo.index - other.index)
      : 0,
    stashInfo
  };
}

function Stash ({ bagLower, bagUpper, className, isLoading, list, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { canJump, jumpCount, stashInfo } = useMemo(
    () => findEntry(bagUpper, bagLower, stashId, list),
    [bagLower, bagUpper, list, stashId]
  );

  return (
    <div className={className}>
      <AddressMini
        value={stashId}
        withBonded
      />
      {stashInfo && (
        canJump
          ? (
            <TxButton
              accountId={stashInfo.stashId}
              icon='caret-up'
              isDisabled={isLoading}
              label={t<string>('Move up {{jumpCount}}', { replace: { jumpCount } })}
              params={[stashInfo.jump]}
              tx={(api.tx.voterBagsList || api.tx.bagsList || api.tx.voterList).putInFrontOf}
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
