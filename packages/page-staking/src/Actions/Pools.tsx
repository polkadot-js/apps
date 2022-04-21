// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletStakingUnappliedSlash } from '@polkadot/types/lookup';
import type { OwnPool, SortedTargets } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { BN } from '@polkadot/util';

import { useTranslation } from '../translate';
import Pool from './Pool';

interface Props {
  allSlashes: [BN, PalletStakingUnappliedSlash[]][];
  className?: string;
  isInElection?: boolean;
  list?: OwnPool[];
  minCommission?: BN;
  targets: SortedTargets;
}

function Pools ({ className, list, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const hdrRef = useRef([
    [t('pool'), 'start', 2],
    [t('account'), 'address'],
    [t('bonded')],
    [],
    []
  ]);

  return (
    <Table
      className={className}
      empty={list && t<string>('Not participating in any pools. Join a pool first.')}
      header={hdrRef.current}
    >
      {list?.map(({ members, poolId }, count): React.ReactNode => (
        <Pool
          count={count}
          key={poolId.toString()}
          members={members}
          poolId={poolId}
          targets={targets}
        />
      ))}
    </Table>
  );
}

export default React.memo(Pools);
