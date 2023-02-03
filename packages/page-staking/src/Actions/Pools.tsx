// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress } from '@polkadot/api-derive/types';
import type { PalletStakingUnappliedSlash } from '@polkadot/types/lookup';
import type { OwnPool, SortedTargets } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
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
  const { api } = useApi();
  const sessionProgress = useCall<DeriveSessionProgress>(api.derive.session.progress);

  const hdrRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t<string>('pools'), 'start', 2],
    [t<string>('account'), 'address'],
    [t<string>('bonded')],
    [t<string>('claimable')],
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
          sessionProgress={sessionProgress}
          targets={targets}
        />
      ))}
    </Table>
  );
}

export default React.memo(Pools);
