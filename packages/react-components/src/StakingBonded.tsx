// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';

import React from 'react';

import { rpcNetwork } from '@polkadot/react-api/util/getEnvironment';
import { DarwiniaStakingStructsStakingLedger } from '@polkadot/react-components/types';
import { FormatBalance } from '@polkadot/react-query';
import { BN } from '@polkadot/util';

interface Props {
  className?: string;
  stakingInfo?: DeriveStakingAccount;
}

function StakingBonded ({ className = '', stakingInfo }: Props): React.ReactElement<Props> | null {
  const balance = stakingInfo?.stakingLedger?.active?.unwrap();
  let darwiniaBalance: BN = new BN(0);

  if (!balance?.gtn(0)) {
    return null;
  }

  const isDarwinia = rpcNetwork.isDarwinia();

  if (isDarwinia && stakingInfo?.stakingLedger) {
    const darwiniaStakingLedger = stakingInfo.stakingLedger as unknown as DarwiniaStakingStructsStakingLedger;
    const lockedRing = darwiniaStakingLedger.activeDepositRing?.unwrap().toBn() || new BN(0);
    const allStakingRing = (darwiniaStakingLedger.active || darwiniaStakingLedger.activeRing).toBn();

    darwiniaBalance = allStakingRing.sub(lockedRing);
  }

  return (
    <FormatBalance
      className={className}
      value={isDarwinia ? darwiniaBalance : balance}
    />
  );
}

export default React.memo(StakingBonded);
