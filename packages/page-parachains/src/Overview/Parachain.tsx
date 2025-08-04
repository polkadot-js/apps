// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, GroupIndex, ParaId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { LeasePeriod, QueuedAction } from '../types.js';
import type { EventMapInfo, ValidatorInfo } from './types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AddressMini, Badge, Expander, ParaLink, styled, Table } from '@polkadot/react-components';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Lifecycle from './Lifecycle.js';
import ParachainInfo from './ParachainInfo.js';
import Periods from './Periods.js';
import useParaInfo from './useParaInfo.js';

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

function renderAddresses (list?: AccountId[], indices?: BN[]): React.ReactElement<unknown>[] | undefined {
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
      validators?.[1].map(({ validatorId }) => validatorId),
      validators?.[1].map(({ indexValidator }) => indexValidator)
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
    <StyledTr className={`${className} ${(lastBacked || lastInclusion || paraInfo.watermark) ? '' : 'isDisabled'}`}>
      <Table.Column.Id value={id} />
      <td className='badge together'>
        {paraInfo.paraInfo?.locked?.isSome && paraInfo.paraInfo?.locked?.unwrap().isFalse
          ? (
            <Badge
              color='orange'
              hover={t('The parachain can be modified, replaced, or removed - it\'s neither protected nor in a transitional state')}
              icon='unlock'
            />
          )
          : <Badge color='transparent' />
        }
        <ParaLink id={id} />
      </td>
      <td className='number media--1400'>
        <Expander
          className={validators ? '' : '--tmp'}
          renderChildren={valRender}
          summary={t('Val. Group {{group}} ({{count}})', {
            replace: {
              count: formatNumber(validators?.[1]?.length || 0),
              group: validators ? validators[0] : 0
            }
          })}
        />
        <Expander
          renderChildren={bckRender}
          summary={t('Non-voters ({{count}})', { replace: { count: formatNumber(nonBacked.length) } })}
        />
      </td>
      <td className='start together hash media--1500'>
        <div className='shortHash'>{paraInfo.headHex}</div>
      </td>
      <td className='start'>
        {paraInfo.updateAt && bestNumber && paraInfo.lifecycle?.isParachain
          ? (
            <>
              {t('Upgrading')}
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
      <td className='number no-pad-left media--900'>
        {lastBacked &&
          <a href={`#/explorer/query/${lastBacked.blockHash}`}>{formatNumber(lastBacked.blockNumber)}</a>
        }
      </td>
      <td className='number no-pad-left media--1600'>
        {lastTimeout &&
          <a href={`#/explorer/query/${lastTimeout.blockHash}`}>{formatNumber(lastTimeout.blockNumber)}</a>
        }
      </td>
      <td className='number no-pad-left'>
        <ParachainInfo id={id} />
      </td>
      <td className='number media--1700'>
        {formatNumber(paraInfo.qHrmpI)}
      </td>
      <td className='number no-pad-left media--1700'>
        {formatNumber(paraInfo.qHrmpE)}
      </td>
      <td className='number together media--1100'>
        <Periods
          leasePeriod={leasePeriod}
          periods={paraInfo.leases}
        />
      </td>
    </StyledTr>
  );
}

const StyledTr = styled.tr`
  &.isDisabled {
    td {
      opacity: 0.5
    }
  }

  td.badge.together > div {
    display: inline-block;
    margin: 0 0.25rem 0 0;
    vertical-align: middle;
  }
`;

export default React.memo(Parachain);
