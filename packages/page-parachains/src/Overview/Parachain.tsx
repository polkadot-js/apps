// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, Vec } from '@polkadot/types';
import type { AccountId, BlockNumber, CandidatePendingAvailability, HeadData, Header, HrmpChannel, HrmpChannelId, ParaId, ParaInfo, ParaLifecycle } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';
import type { EventMapInfo, QueuedAction, ValidatorInfo } from './types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AddressMini, Expander, ParaLink } from '@polkadot/react-components';
import { useApi, useCall, useCallMulti, useParaApi } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { BN_ZERO, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { sliceHex } from '../util';
import Lifecycle from './Lifecycle';

interface Props {
  bestNumber?: BN;
  channelDst?: [HrmpChannelId, HrmpChannel][];
  channelSrc?: [HrmpChannelId, HrmpChannel][];
  className?: string;
  id: ParaId;
  isScheduled?: boolean;
  lastBacked?: EventMapInfo;
  lastInclusion?: EventMapInfo;
  lastTimeout?: EventMapInfo;
  nextAction?: QueuedAction;
  sessionValidators?: AccountId[] | null;
  validators?: ValidatorInfo[];
}

type QueryResult = [Option<HeadData>, Option<BlockNumber>, Option<ParaLifecycle>, Vec<Codec>, Vec<Codec>, Vec<Codec>, Vec<Codec>, Option<BlockNumber>, Option<CandidatePendingAvailability>, Option<ParaInfo>];

interface QueryState {
  headHex: string | null;
  lifecycle: ParaLifecycle | null;
  paraInfo: ParaInfo | null;
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
    paraInfo: null,
    pendingAvail: null,
    qDmp: 0,
    qHrmpE: 0,
    qHrmpI: 0,
    qUmp: 0,
    updateAt: null,
    watermark: null
  },
  transform: ([headData, optUp, optLifecycle, dmp, ump, hrmpE, hrmpI, optWm, optPending, optInfo]: QueryResult): QueryState => ({
    headHex: headData.isSome
      ? sliceHex(headData.unwrap())
      : null,
    lifecycle: optLifecycle.unwrapOr(null),
    paraInfo: optInfo.unwrapOr(null),
    pendingAvail: optPending.unwrapOr(null),
    qDmp: dmp.length,
    qHrmpE: hrmpE.length,
    qHrmpI: hrmpI.length,
    qUmp: ump.length,
    updateAt: optUp.unwrapOr(null),
    watermark: optWm.unwrapOr(null)
  })
};

function renderAddresses (list?: AccountId[]): JSX.Element[] | undefined {
  return list?.map((id) => (
    <AddressMini
      key={id.toString()}
      value={id}
    />
  ));
}

function Parachain ({ bestNumber, channelDst, channelSrc, className = '', id, lastBacked, lastInclusion, lastTimeout, nextAction, sessionValidators, validators }: Props): React.ReactElement<Props> {
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
    [api.query.inclusion.pendingAvailability, id],
    [api.query.registrar.paras, id]
  ], optionsMulti);
  const [nonBacked, setNonBacked] = useState<AccountId[]>([]);

  const channelCounts = useMemo(
    () => [
      channelDst ? channelDst.reduce((count, [, channel]) => count.iadd(channel.msgCount), new BN(0)) : BN_ZERO,
      channelSrc ? channelSrc.reduce((count, [, channel]) => count.iadd(channel.msgCount), new BN(0)) : BN_ZERO
    ],
    [channelDst, channelSrc]
  );

  const blockDelay = useMemo(
    () => bestNumber && (
      lastInclusion
        ? bestNumber.sub(lastInclusion.blockNumber)
        : paraInfo.watermark
          ? bestNumber.sub(paraInfo.watermark)
          : undefined
    ),
    [bestNumber, lastInclusion, paraInfo]
  );

  const valRender = useCallback(
    () => renderAddresses(validators?.map(({ validatorId }) => validatorId)),
    [validators]
  );

  const bckRender = useCallback(
    () => renderAddresses(nonBacked),
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
      <td className='badge'><ParaLink id={id} /></td>
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
      <td className='number no-pad-left'>
        {lastInclusion
          ? <a href={`#/explorer/query/${lastInclusion.blockHash}`}>{formatNumber(lastInclusion.blockNumber)}</a>
          : paraInfo.watermark && formatNumber(paraInfo.watermark)
        }
      </td>
      <td className='number no-pad-left'>
        {lastBacked &&
          <a href={`#/explorer/query/${lastBacked.blockHash}`}>{formatNumber(lastBacked.blockNumber)}</a>
        }
      </td>
      <td className='number no-pad-left'>
        {lastTimeout &&
          <a href={`#/explorer/query/${lastTimeout.blockHash}`}>{formatNumber(lastTimeout.blockNumber)}</a>
        }
      </td>
      <td className='number media--900 no-pad-left'>{paraBest && <>{formatNumber(paraBest)}</>}</td>
      <td className='number media--1200'>
        {paraInfo.updateAt && bestNumber && (
          <>
            <BlockToTime value={paraInfo.updateAt.sub(bestNumber)} />
            #{formatNumber(paraInfo.updateAt)}
          </>
        )}
      </td>
      <td className='number media--1300'>
        {formatNumber(paraInfo.qUmp)}&nbsp;/&nbsp;{formatNumber(paraInfo.qDmp)}&nbsp;/&nbsp;{formatNumber(paraInfo.qHrmpE)}&nbsp;/&nbsp;{formatNumber(paraInfo.qHrmpI)}&nbsp;({formatNumber(channelCounts[0])}&nbsp;/&nbsp;{formatNumber(channelCounts[1])})
      </td>
    </tr>
  );
}

export default React.memo(Parachain);
