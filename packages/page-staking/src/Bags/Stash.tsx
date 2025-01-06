// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ListNode } from './types.js';

import React, { useMemo } from 'react';

import { AddressMini, styled, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

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

function findEntry (_upper: BN, _bagLower: BN, stashId: string, list: ListNode[] = []): Entry {
  const stashInfo = list.find((o) => o.stashId === stashId) || null;
  const other = (stashInfo?.jump && list.find((o) => o.stashId === stashInfo.jump)) || null;

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
    <StyledDiv className={className}>
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
              label={t('Move up {{jumpCount}}', { replace: { jumpCount } })}
              params={[stashInfo.jump]}
              tx={(api.tx.voterBagsList || api.tx.bagsList || api.tx.voterList).putInFrontOf}
            />
          )
          : null
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .ui--AddressMini {
    vertical-align: middle;
  }
`;

export default React.memo(Stash);
