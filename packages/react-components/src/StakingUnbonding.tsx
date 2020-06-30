// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionProgress, DeriveStakingAccount, DeriveUnlocking } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN_ZERO, formatBalance, formatNumber } from '@polkadot/util';

import Icon from './Icon';
import Tooltip from './Tooltip';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  stakingInfo?: DeriveStakingAccount;
}

function remainingBlocks (remainingEras: BN, { eraLength, eraProgress }: DeriveSessionProgress): BN {
  return remainingEras
    .subn(1)
    .mul(eraLength)
    .add(eraLength.sub(eraProgress));
}

function StakingUnbonding ({ className = '', stakingInfo }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const progress = useCall<DeriveSessionProgress>(api.derive.session.progress, []);
  const { t } = useTranslation();

  if (!stakingInfo?.unlocking || !progress) {
    return null;
  }

  const filtered = stakingInfo.unlocking.filter(({ remainingEras, value }) => value.gtn(0) && remainingEras.gtn(0));

  if (!filtered.length) {
    return null;
  }

  const mapped = filtered.map((unlock): [DeriveUnlocking, BN] => [unlock, remainingBlocks(unlock.remainingEras, progress)]);
  const total = mapped.reduce((total, [{ value }]) => total.add(value), BN_ZERO);
  const trigger = `${stakingInfo.accountId.toHex()}-unlocking-trigger`;

  return (
    <div className={className}>
      <Icon
        icon='clock'
        tooltip={trigger}
      />
      <FormatBalance value={total} />
      <Tooltip
        text={mapped.map(([{ value }, blocks], index): React.ReactNode => (
          <div
            className='row'
            key={index}
          >
            <div>{t<string>('Unbonding {{value}}, ', { replace: { value: formatBalance(value, { forceUnit: '-' }) } })}</div>
            <div className='faded'>
              <BlockToTime
                blocks={blocks}
                label={`${t<string>('{{blocks}} blocks', { replace: { blocks: formatNumber(blocks) } })}, `}
              />
            </div>
          </div>
        ))}
        trigger={trigger}
      />
    </div>
  );
}

export default React.memo(styled(StakingUnbonding)`
  white-space: nowrap;

  .ui--Icon {
    margin-left: 0;
    margin-right: 0.25rem;
  }

  .ui--FormatBalance {
    display: inline-block;
  }
`);
