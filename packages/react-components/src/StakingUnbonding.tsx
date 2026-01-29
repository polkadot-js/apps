// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress, DeriveStakingAccount } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';

import { useApi, useCall, useStakingAsyncApis } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO, formatBalance, formatNumber } from '@polkadot/util';

import Icon from './Icon.js';
import { styled } from './styled.js';
import Tooltip from './Tooltip.js';
import { useTranslation } from './translate.js';

interface Unlocking {
  remainingEras: BN;
  value: BN;
}

interface DeriveStakingAccountPartial {
  accountId: DeriveStakingAccount['accountId'] | string;
  unlocking?: Unlocking[];
}

interface Props {
  iconPosition?: 'left' | 'right';
  className?: string;
  stakingInfo?: DeriveStakingAccountPartial;
}

function extractTotals (stakingInfo?: DeriveStakingAccountPartial, progress?: DeriveSessionProgress): [[Unlocking, BN, BN][], BN, boolean] {
  if (!stakingInfo?.unlocking || !progress) {
    return [[], BN_ZERO, false];
  }

  const isStalled = progress.eraProgress.gt(BN_ZERO) && progress.eraProgress.gt(progress.eraLength);
  const mapped = stakingInfo.unlocking
    .filter(({ remainingEras, value }) => value.gt(BN_ZERO) && remainingEras.gt(BN_ZERO))
    .map((unlock): [Unlocking, BN, BN] => [
      unlock,
      unlock.remainingEras,
      unlock.remainingEras
        .sub(BN_ONE)
        .imul(progress.eraLength)
        .iadd(progress.eraLength)
        .isub(
          // in the case of a stalled era, this would not be accurate. We apply the mod here
          // otherwise we would enter into negative values (which is "accurate" since we are
          // overdue, but confusing since it implied it needed to be done already).
          //
          // This does mean that in cases of era stalls we would have an jiggling time, i.e.
          // would be down and then when a session completes, would be higher again, just to
          // repeat the cycle again
          //
          // See https://github.com/polkadot-js/apps/issues/9397#issuecomment-1532465939
          isStalled
            ? progress.eraProgress.mod(progress.eraLength)
            : progress.eraProgress
        )
    ]);
  const total = mapped.reduce((total, [{ value }]) => total.iadd(value), new BN(0));

  return [mapped, total, isStalled];
}

function StakingUnbonding ({ className = '', iconPosition = 'left', stakingInfo }: Props): React.ReactElement<Props> | null {
  const { api: connectedApi } = useApi();
  const { isStakingAsync, rcApi } = useStakingAsyncApis();
  const api = useMemo(() => (isStakingAsync ? rcApi : connectedApi), [connectedApi, isStakingAsync, rcApi]);
  const progress = useCall<DeriveSessionProgress>(api?.derive.session.progress);
  const { t } = useTranslation();

  const [mapped, total, isStalled] = useMemo(
    () => extractTotals(stakingInfo, progress),
    [progress, stakingInfo]
  );

  if (!stakingInfo || !mapped.length) {
    return null;
  }

  const trigger = `${stakingInfo.accountId.toString()}-unlocking-trigger`;

  return (
    <StyledDiv className={className}>
      {iconPosition === 'left' && (
        <Icon
          className='left'
          icon='clock'
          tooltip={trigger}
        />
      )}
      <FormatBalance value={total} />
      <Tooltip trigger={trigger}>
        {mapped.map(([{ value }, eras, blocks], index): React.ReactNode => (
          <div
            className='row'
            key={index}
          >
            <div>{t('Unbonding {{value}}', { replace: { value: formatBalance(value, { forceUnit: '-' }) } })}</div>
            <div className='faded'>
              {api?.consts.babe?.epochDuration
                ? (
                  <BlockToTime
                    api={api}
                    label={`${t('{{blocks}} blocks', { replace: { blocks: formatNumber(blocks) } })}, `}
                    value={blocks}
                  />
                )
                : t('{{eras}} eras remaining', { replace: { eras: formatNumber(eras) } })
              }
            </div>
            {isStalled && (
              <div className='faded'>{t('Era is overdue for completion due to current network operating conditions')}</div>
            )}
          </div>
        ))}
      </Tooltip>
      {iconPosition === 'right' && (
        <Icon
          className='right'
          icon='clock'
          tooltip={trigger}
        />
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  white-space: nowrap;

  .ui--Icon.left {
    margin-left: 0;
    margin-right: 0.25rem;
  }

  .ui--Icon.right {
    margin-left: 0.25rem;
    margin-right: 0;
  }

  .ui--FormatBalance {
    display: inline-block;
  }
`;

export default React.memo(StakingUnbonding);
