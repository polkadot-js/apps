// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress, DeriveStakingAccount, DeriveUnlocking } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO, formatBalance, formatNumber } from '@polkadot/util';

import Icon from './Icon';
import Tooltip from './Tooltip';
import { useTranslation } from './translate';

interface Props {
  iconPosition: 'left' | 'right';
  className?: string;
  stakingInfo?: DeriveStakingAccount;
}

function extractTotals (stakingInfo?: DeriveStakingAccount, progress?: DeriveSessionProgress): [[DeriveUnlocking, BN, BN][], BN] {
  if (!stakingInfo?.unlocking || !progress) {
    return [[], BN_ZERO];
  }

  const mapped = stakingInfo.unlocking
    .filter(({ remainingEras, value }) => value.gt(BN_ZERO) && remainingEras.gt(BN_ZERO))
    .map((unlock): [DeriveUnlocking, BN, BN] => [
      unlock,
      unlock.remainingEras,
      unlock.remainingEras
        .sub(BN_ONE)
        .imul(progress.eraLength)
        .iadd(progress.eraLength)
        .isub(progress.eraProgress)
    ]);
  const total = mapped.reduce((total, [{ value }]) => total.iadd(value), new BN(0));

  return [mapped, total];
}

function StakingUnbonding ({ className = '', iconPosition = 'left', stakingInfo }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const progress = useCall<DeriveSessionProgress>(api.derive.session.progress);
  const { t } = useTranslation();

  const [mapped, total] = useMemo(
    () => extractTotals(stakingInfo, progress),
    [progress, stakingInfo]
  );

  if (!stakingInfo || !mapped.length) {
    return null;
  }

  const trigger = `${stakingInfo.accountId.toString()}-unlocking-trigger`;

  return (
    <div className={className}>
      {iconPosition === 'left' && (
        <Icon
          className='left'
          icon='clock'
          tooltip={trigger}
        />
      )}
      <FormatBalance value={total} />
      <Tooltip
        text={mapped.map(([{ value }, eras, blocks], index): React.ReactNode => (
          <div
            className='row'
            key={index}
          >
            <div>{t<string>('Unbonding {{value}}', { replace: { value: formatBalance(value, { forceUnit: '-' }) } })}</div>
            <div className='faded'>
              {api.consts.babe?.epochDuration
                ? (
                  <BlockToTime
                    label={`${t<string>('{{blocks}} blocks', { replace: { blocks: formatNumber(blocks) } })}, `}
                    value={blocks}
                  />
                )
                : t<string>('{{eras}} eras remaining', { replace: { eras: formatNumber(eras) } })
              }
            </div>
          </div>
        ))}
        trigger={trigger}
      />
      {iconPosition === 'right' && (
        <Icon
          className='right'
          icon='clock'
          tooltip={trigger}
        />
      )}
    </div>
  );
}

export default React.memo(styled(StakingUnbonding)`
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
`);
