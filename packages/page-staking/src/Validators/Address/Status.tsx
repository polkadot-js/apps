// Copyright 2017-2024 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { Badge } from '@polkadot/react-components';
import {useAccounts, useApi, useCall} from '@polkadot/react-hooks';

import MaxBadge from '../../MaxBadge.js';

interface Props {
  isChilled?: boolean;
  isElected: boolean;
  isMain?: boolean;
  isPara?: boolean;
  isRelay?: boolean;
  nominators?: { nominatorId: string }[];
  onlineCount?: false | BN;
  onlineMessage?: boolean;
  address: string;
}

const NO_NOMS: { nominatorId: string }[] = [];

function Status ({ isChilled, isElected, isMain, isPara, isRelay, nominators = NO_NOMS, onlineCount, onlineMessage, address }: Props): React.ReactElement<Props> {
  const { allAccounts } = useAccounts();
  const { api } = useApi()
  const accountStatuses = useCall<boolean[]>(api.rpc.xstaking.checkCandidate, [address])
  const blockCount = onlineCount && onlineCount.toNumber();

  const isNominating = useMemo(
    () => nominators.some(({ nominatorId }) => allAccounts.includes(nominatorId)),
    [allAccounts, nominators]
  );

  return (
    <>
      {accountStatuses && !accountStatuses?.toJSON()?.[0] &&
        (
          <Badge
            color='red'
            icon='balance-scale-right'
          />
        )
      }
      {accountStatuses && !accountStatuses?.toJSON()?.[1] &&
        (
          <Badge
            color='red'
            icon='skull-crossbones'
          />
        )
      }
      {accountStatuses && !accountStatuses?.toJSON()?.[2] &&
        (
          <Badge
            color='red'
            icon='balance-scale-right'
          />
        )
      }
      {/*{isNominating*/}
      {/*  ? (*/}
      {/*    <Badge*/}
      {/*      className='media--1100'*/}
      {/*      color='green'*/}
      {/*      icon='hand-paper'*/}
      {/*    />*/}
      {/*  )*/}
      {/*  : (*/}
      {/*    <Badge*/}
      {/*      className='media--1100'*/}
      {/*      color='transparent'*/}
      {/*    />*/}
      {/*  )*/}
      {/*}*/}
      {/*{isRelay && (*/}
      {/*  isPara*/}
      {/*    ? (*/}
      {/*      <Badge*/}
      {/*        className='media--1100'*/}
      {/*        color='purple'*/}
      {/*        icon='vector-square'*/}
      {/*      />*/}
      {/*    )*/}
      {/*    : (*/}
      {/*      <Badge*/}
      {/*        className='media--1100'*/}
      {/*        color='transparent'*/}
      {/*      />*/}
      {/*    )*/}
      {/*)}*/}
      {/*{isChilled*/}
      {/*  ? (*/}
      {/*    <Badge*/}
      {/*      className='media--1000'*/}
      {/*      color='red'*/}
      {/*      icon='cancel'*/}
      {/*    />*/}
      {/*  )*/}
      {/*  : isElected*/}
      {/*    ? (*/}
      {/*      <Badge*/}
      {/*        className='media--1000'*/}
      {/*        color='blue'*/}
      {/*        icon='chevron-right'*/}
      {/*      />*/}
      {/*    )*/}
      {/*    : (*/}
      {/*      <Badge*/}
      {/*        className='media--1000'*/}
      {/*        color='transparent'*/}
      {/*      />*/}
      {/*    )*/}
      {/*}*/}
      {/*{isMain && (*/}
      {/*  blockCount*/}
      {/*    ? (*/}
      {/*      <Badge*/}
      {/*        className='media--900'*/}
      {/*        color='green'*/}
      {/*        info={blockCount}*/}
      {/*      />*/}
      {/*    )*/}
      {/*    : onlineMessage*/}
      {/*      ? (*/}
      {/*        <Badge*/}
      {/*          className='media--900'*/}
      {/*          color='green'*/}
      {/*          icon='envelope'*/}
      {/*        />*/}
      {/*      )*/}
      {/*      : (*/}
      {/*        <Badge*/}
      {/*          className='media--900'*/}
      {/*          color='transparent'*/}
      {/*        />*/}
      {/*      )*/}
      {/*)}*/}
      <MaxBadge numNominators={nominators.length} />
    </>
  );
}

export default React.memo(Status);
