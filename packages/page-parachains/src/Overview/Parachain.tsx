// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, GroupIndex, ParaId } from '@polkadot/types/interfaces';
import type { LeasePeriod, QueuedAction } from '../types';
import type { EventMapInfo, ValidatorInfo } from './types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AddressMini, Expander, ParaLink } from '@polkadot/react-components';
import { BlockToTime } from '@polkadot/react-query';
import { BN, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Lifecycle from './Lifecycle';
import ParachainInfo from './ParachainInfo';
import Periods from './Periods';
import useParaInfo from './useParaInfo';

interface Props {
  bestNumber?: BN;
  className?: string;
  id: ParaId;
  isScheduled?: boolean;
  lastBacked?: EventMapInfo;
  lastInclusion?: EventMapInfo;
  lastTimeout?: EventMapInfo;
  leasePeriod?: LeasePeriod;
  nextAction?: QueuedAction;
  sessionValidators?: AccountId[] | null;
  validators?: [GroupIndex, ValidatorInfo[]];
}

function renderAddresses (list?: AccountId[], indices?: BN[]): JSX.Element[] | undefined {
  return list?.map((id, index) => (
    <AddressMini
      key={id.toString()}
      nameExtra={indices && <>&nbsp;{`(${formatNumber(indices[index])})`}</>}
      value={id}
    />
  ));
}

function Parachain ({ bestNumber, className = '', id, lastBacked, lastInclusion, lastTimeout, leasePeriod, nextAction, sessionValidators, validators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const paraInfo = useParaInfo(id);
  const [nonBacked, setNonBacked] = useState<AccountId[]>([]);

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
    () => renderAddresses(
      validators && validators[1].map(({ validatorId }) => validatorId),
      validators && validators[1].map(({ indexValidator }) => indexValidator)
    ),
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
      <td className='number media--1400'>
        {validators && validators[1].length !== 0 && (
          <Expander
            renderChildren={valRender}
            summary={t<string>('Val. Group {{group}} ({{count}})', {
              replace: {
                count: formatNumber(validators[1].length),
                group: validators[0]
              }
            })}
          />
        )}
        {nonBacked && (
          <Expander
            renderChildren={bckRender}
            summary={t<string>('Non-voters ({{count}})', { replace: { count: formatNumber(nonBacked.length) } })}
          />
        )}
      </td>
      <td className='start together hash media--1500'>{paraInfo.headHex}</td>
      <td className='start'>
        {paraInfo.updateAt && bestNumber && paraInfo.lifecycle?.isParachain
          ? (
            <>
              {t<string>('Upgrading')}
              <BlockToTime value={paraInfo.updateAt.sub(bestNumber)} />
              #{formatNumber(paraInfo.updateAt)}
            </>
          )
          : (
            <Lifecycle
              lifecycle={paraInfo.lifecycle}
              nextAction={nextAction}
            />
          )
        }
      </td>
      <td className='all' />
      <td className='number'>{blockDelay && <BlockToTime value={blockDelay} />}</td>
      <td className='number no-pad-left'>
        {lastInclusion
          ? <a href={`#/explorer/query/${lastInclusion.blockHash}`}>{formatNumber(lastInclusion.blockNumber)}</a>
          : paraInfo.watermark && formatNumber(paraInfo.watermark)
        }
      </td>
      <td className='number no-pad-left media--800'>
        {lastBacked &&
          <a href={`#/explorer/query/${lastBacked.blockHash}`}>{formatNumber(lastBacked.blockNumber)}</a>
        }
      </td>
      <td className='number no-pad-left media--900'>
        {lastTimeout &&
          <a href={`#/explorer/query/${lastTimeout.blockHash}`}>{formatNumber(lastTimeout.blockNumber)}</a>
        }
      </td>
      <td className='number no-pad-left'>
        <ParachainInfo id={id} />
      </td>
      <td className='number media--1200'>
        {formatNumber(paraInfo.qHrmpI)}
      </td>
      <td className='number no-pad-left media--1200'>
        {formatNumber(paraInfo.qHrmpE)}
      </td>
      <td className='number together media--1000'>
        <Periods
          leasePeriod={leasePeriod}
          periods={paraInfo.leases}
        />
      </td>
    </tr>
  );
}

export default React.memo(Parachain);
