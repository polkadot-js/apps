// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../../types';

import React, { useMemo, useRef } from 'react';

import { AddressSmall, Table, Tag } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Status from './Status';
import useExposure from './useExposure';
import useHeartbeat from './useHeartbeat';

interface Props {
  className?: string;
  isRelay: boolean;
  points?: number;
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
  validator: Validator;
}

interface PropsExpanded {
  className?: string;
  validator: Validator;
}

function ValidatorExpanded ({ className = '' }: PropsExpanded): React.ReactElement<PropsExpanded> {
  return (
    <tr className={`${className} isExpanded isLast`}>
      <td />
      <td />
      <td />
      <td />
    </tr>
  );
}

function Validator ({ className = '', isRelay, points, sessionInfo, toggleFavorite, validator }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleExpanded] = useToggle();
  const pointsRef = useRef<{ counter: number, points: number }>({ counter: 0, points: 0 });
  const exposure = useExposure(validator, sessionInfo);
  const heartbeat = useHeartbeat(validator, sessionInfo);

  const pointsAnimClass = useMemo(
    (): string => {
      if (!points || pointsRef.current.points === points) {
        return '';
      }

      pointsRef.current.points = points;
      pointsRef.current.counter = (pointsRef.current.counter + 1) % 25;

      return `greyAnim-${pointsRef.current.counter}`;
    },
    [points, pointsRef]
  );

  return (
    <>
      <tr className={`${className} isExpanded isFirst packedBottom`}>
        <Table.Column.Favorite
          address={validator.stashId}
          isFavorite={validator.isFavorite}
          toggle={toggleFavorite}
        />
        <td
          className='statusInfo'
          rowSpan={2}
        >
          <Status
            heartbeat={heartbeat}
            isRelay={isRelay}
            validator={validator}
          />
        </td>
        <td className='address relative all'>
          <AddressSmall value={validator.stashId} />
          {points && (
            <Tag
              className={`${pointsAnimClass} absolute`}
              color='lightgrey'
              label={formatNumber(points)}
            />
          )}
        </td>
        <Table.Column.Expand
          isExpanded={isExpanded}
          toggle={toggleExpanded}
        />
      </tr>
      <tr className={`${className} isExpanded ${isExpanded ? '' : 'isLast'} packedTop`}>
        <td />
        <Table.Column.Balance
          className='relative'
          label={
            exposure?.waiting && (
              <>
                <span>(</span>
                <FormatBalance value={exposure.waiting.total} />
                <span>, {exposure.waiting.others.length})</span>
              </>
            )
          }
          value={exposure?.clipped?.total}
          withLoading
        />
        <td />
      </tr>
      {isExpanded && (
        <ValidatorExpanded validator={validator} />
      )}
    </>
  );
}

export default React.memo(Validator);
