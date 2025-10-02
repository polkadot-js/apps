// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedTargets } from '@polkadot/app-staking/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { PalletStakingUnappliedSlash } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Account from './Account/index.js';

interface Props {
  allSlashes: [BN, PalletStakingUnappliedSlash[]][];
  className?: string;
  footer: React.ReactNode;
  isInElection?: boolean;
  list?: StakerState[];
  minCommission?: BN;
  targets: SortedTargets;
}

function Accounts ({ allSlashes, className, footer, isInElection, list, minCommission, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const hdrRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t('stashes'), 'start', 2],
    [t('controller'), 'address'],
    [t('rewards'), 'start media--1200'],
    [t('bonded'), 'number'],
    [],
    []
  ]);

  return (
    <Table
      className={className}
      empty={list && t('No funds staked yet. Bond funds to validate or nominate a validator')}
      footer={footer}
      header={hdrRef.current}
    >
      {list?.map((info): React.ReactNode => (
        <Account
          allSlashes={allSlashes}
          info={info}
          isDisabled={isInElection}
          key={info.stashId}
          minCommission={minCommission}
          targets={targets}
        />
      ))}
    </Table>
  );
}

export default React.memo(Accounts);
