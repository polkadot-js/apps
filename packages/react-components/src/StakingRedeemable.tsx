// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingAccount } from '@polkadot/api-derive/types';

import React from 'react';
import { useAccounts } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import TxButton from './TxButton';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  stakingInfo?: DeriveStakingAccount;
}

function StakingRedeemable ({ className, stakingInfo }: Props): React.ReactElement<Props> | null {
  const { allAccounts } = useAccounts();
  const { t } = useTranslation();

  if (!stakingInfo?.redeemable?.gtn(0)) {
    return null;
  }

  return (
    <div className={className}>
      <FormatBalance value={stakingInfo.redeemable}>
        {allAccounts.includes((stakingInfo.controllerId || '').toString()) && (
          <TxButton
            accountId={stakingInfo.controllerId}
            icon='lock'
            isIcon
            key='unlock'
            params={[]}
            tooltip={t('Withdraw these unbonded funds')}
            tx='staking.withdrawUnbonded'
          />
        )}
      </FormatBalance>
    </div>
  );
}

export default React.memo(StakingRedeemable);
