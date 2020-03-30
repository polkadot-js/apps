// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingAccount } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatBalance, formatNumber } from '@polkadot/util';

import Icon from './Icon';
import Tooltip from './Tooltip';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  stakingInfo?: DeriveStakingAccount;
}

function StakingUnbonding ({ className, stakingInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!stakingInfo?.unlocking) {
    return null;
  }

  const total = stakingInfo.unlocking.reduce((total, { value }): BN => total.add(value), new BN(0));

  if (total.eqn(0)) {
    return null;
  }

  const trigger = `${stakingInfo.accountId}-unlocking-trigger`;

  return (
    <div className={className}>
      <FormatBalance value={total} />
      <Icon
        name='info circle'
        data-tip
        data-for={trigger}
      />
      <Tooltip
        text={stakingInfo.unlocking.map(({ remainingBlocks, value }, index): React.ReactNode => (
          <div key={index}>
            {t('Unbonding {{value}}, {{remaining}} blocks left', {
              replace: {
                remaining: formatNumber(remainingBlocks),
                value: formatBalance(value, { forceUnit: '-' })
              }
            })}
          </div>
        ))}
        trigger={trigger}
      />
    </div>
  );
}

export default React.memo(styled(StakingUnbonding)`
  i.icon {
    margin-left: 0.25rem;
    margin-right: 0;
  }
`);
