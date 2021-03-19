// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, Vec } from '@polkadot/types';
import type { AccountId, BlockNumber, CandidatePendingAvailability, HeadData, Header, ParaId, ParaLifecycle } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';
import type { QueuedAction } from './types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AddressMini, Badge, Expander, ParaLink } from '@polkadot/react-components';
import { useApi, useCall, useCallMulti, useParaApi } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { sliceHex } from '../util';
import Lifecycle from './Lifecycle';

interface Props {
  bestNumber?: BN;
  className?: string;
  id: ParaId;
  isScheduled?: boolean;
  lastBacked?: [string, string, BN];
  lastInclusion?: [string, string, BN];
  nextAction?: QueuedAction;
  sessionValidators?: AccountId[] | null;
  validators?: AccountId[];
}

type QueryResult = [Option<HeadData>, Option<BlockNumber>, Option<ParaLifecycle>, Vec<Codec>, Vec<Codec>, Vec<Codec>, Vec<Codec>, Option<BlockNumber>, Option<CandidatePendingAvailability>];

interface QueryState {
  headHex: string | null;
  lifecycle: ParaLifecycle | null;
  pendingAvail: CandidatePendingAvailability | null;
  updateAt: BlockNumber | null;
  qDmp: number;
  qUmp: number;
  qHrmpE: number;
  qHrmpI: number;
  watermark: BlockNumber | null;
}

const transformHeader = {
  transform: (header: Header) => header.number.unwrap()
};

const optionsMulti = {
  defaultValue: {
    headHex: null,
    lifecycle: null,
    pendingAvail: null,
    qDmp: 0,
    qHrmpE: 0,
    qHrmpI: 0,
    qUmp: 0,
    updateAt: null,
    watermark: null
  },
  transform: ([headData, optUp, optLifecycle, dmp, ump, hrmpE, hrmpI, optWm, optPending]: QueryResult): QueryState => ({
    headHex: headData.isSome
      ? sliceHex(headData.unwrap())
      : null,
    lifecycle: optLifecycle.unwrapOr(null),
    pendingAvail: optPending.unwrapOr(null),
    qDmp: dmp.length,
    qHrmpE: hrmpE.length,
    qHrmpI: hrmpI.length,
    qUmp: ump.length,
    updateAt: optUp.unwrapOr(null),
    watermark: optWm.unwrapOr(null)
  })
};

function Parachain ({ bestNumber, className = '', id, isScheduled, lastBacked, lastInclusion, nextAction, sessionValidators, validators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { api: paraApi } = useParaApi(id);
  const paraBest = useCall<BlockNumber>(paraApi?.rpc.chain.subscribeNewHeads, undefined, transformHeader);
  const paraInfo = useCallMulti<QueryState>([
    [api.query.paras.heads, id],
    [api.query.paras.futureCodeUpgrades, id],
    [api.query.paras.paraLifecycles, id],
    [api.query.dmp.downwardMessageQueues, id],
    [api.query.ump.relayDispatchQueues, id],
    [api.query.hrmp.hrmpEgressChannelsIndex, id],
    [api.query.hrmp.hrmpIngressChannelsIndex, id],
    [api.query.hrmp.hrmpWatermarks, id],
    [api.query.inclusion.pendingAvailability, id]
  ], optionsMulti);
  const [nonBacked, setNonBacked] = useState<AccountId[]>([]);

  const blockDelay = useMemo(
    () => bestNumber && (
      lastInclusion
        ? bestNumber.sub(lastInclusion[2])
        : paraInfo.watermark
          ? bestNumber.sub(paraInfo.watermark)
          : undefined
    ),
    [bestNumber, lastInclusion, paraInfo]
  );

  const valRender = useCallback(
    () => validators?.map((id) => (
      <AddressMini
        key={id.toString()}
        value={id}
      />
    )),
    [validators]
  );

  const bckRender = useCallback(
    () => nonBacked.map((id) => (
      <AddressMini
        key={id.toString()}
        value={id}
      />
    )),
    [nonBacked]
  );

  useEffect((): void => {
    if (sessionValidators) {
      if (paraInfo.pendingAvail) {
        const list = paraInfo.pendingAvail.availabilityVotes.toHuman()
          .slice(2)
          .replace(/_/g, '')
          .split('')
          .map((c, index) => c === '0' ? sessionValidators[index] : null)
          .filter((v, index): v is AccountId => !!v && index < sessionValidators.length);

        list.length !== sessionValidators.length && setNonBacked(list);
      } else {
        setNonBacked([]);
      }
    }
  }, [paraInfo, sessionValidators]);

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='badge'>{isScheduled && (
        <Badge
          color='green'
          icon='clock'
        />
      )}</td>
      <td className='badge together'><ParaLink id={id} /></td>
      <td className='number media--1500'>
        {validators && validators.length !== 0 && (
          <Expander
            renderChildren={valRender}
            summary={t<string>('Validators ({{count}})', { replace: { count: formatNumber(validators.length) } })}
          />
        )}
        {nonBacked && (
          <Expander
            renderChildren={bckRender}
            summary={t<string>('Non-voters ({{count}})', { replace: { count: formatNumber(nonBacked.length) } })}
          />
        )}
      </td>
      <td className='start together hash'>{paraInfo.headHex}</td>
      <td className='start media--1100'>
        <Lifecycle
          lifecycle={paraInfo.lifecycle}
          nextAction={nextAction}
        />
      </td>
      <td className='all' />
      <td className='number'>{blockDelay && <BlockToTime value={blockDelay} />}</td>
      <td className='number'>
        {lastInclusion
          ? <a href={`#/explorer/query/${lastInclusion[0]}`}>{formatNumber(lastInclusion[2])}</a>
          : paraInfo.watermark && formatNumber(paraInfo.watermark)
        }
      </td>
      <td className='number'>
        {lastBacked &&
          <a href={`#/explorer/query/${lastBacked[0]}`}>{formatNumber(lastBacked[2])}</a>
        }
      </td>
      <td className='number media--900'>{paraBest && <>{formatNumber(paraBest)}</>}</td>
      <td className='number media--1300'>
        {paraInfo.updateAt && bestNumber && (
          <>
            <BlockToTime value={bestNumber.sub(paraInfo.updateAt)} />
            #{formatNumber(paraInfo.updateAt)}
          </>
        )}
      </td>
      <td className='number media--1200'>
        {formatNumber(paraInfo.qUmp)}&nbsp;/&nbsp;{formatNumber(paraInfo.qDmp)}&nbsp;/&nbsp;{formatNumber(paraInfo.qHrmpE)}&nbsp;/&nbsp;{formatNumber(paraInfo.qHrmpI)}
      </td>
    </tr>
  );
}

export default React.memo(Parachain);
