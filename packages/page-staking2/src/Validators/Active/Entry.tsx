// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../../types.js';

import React, { useMemo, useRef } from 'react';

import { Table, Tag } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import useExposure from '../useExposure.js';
import useHeartbeat from '../useHeartbeat.js';
import Bottom from './Row/Bottom.js';
import Middle from './Row/Middle.js';
import Top from './Row/Top.js';

interface Props {
  className?: string;
  points?: number;
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
  validator: Validator;
}

interface PropsExpanded {
  className?: string;
  validator: Validator;
}

function EntryExpanded ({ className = '' }: PropsExpanded): React.ReactElement<PropsExpanded> {
  return <td className={className} />;
}

function Entry ({ className = '', points, sessionInfo, toggleFavorite, validator }: Props): React.ReactElement<Props> {
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
      <Top
        className={className}
        heartbeat={heartbeat}
        isExpanded={isExpanded}
        toggleExpanded={toggleExpanded}
        toggleFavorite={toggleFavorite}
        validator={validator}
      >
        {points && (
          <Tag
            className={`${pointsAnimClass} absolute`}
            color='lightgrey'
            label={formatNumber(points)}
          />
        )}
      </Top>
      <Middle
        className={className}
        isExpanded={isExpanded}
      >
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
      </Middle>
      <Bottom
        className={className}
        isExpanded={isExpanded}
      >
        <EntryExpanded validator={validator} />
      </Bottom>
    </>
  );
}

export default React.memo(Entry);
