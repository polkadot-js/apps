// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../../types';

import React, { useMemo, useRef } from 'react';

import { Table, Tag } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Bottom from './Row/Bottom';
import Middle from './Row/Middle';
import Top from './Row/Top';
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

function ActiveExpanded ({ className = '' }: PropsExpanded): React.ReactElement<PropsExpanded> {
  return <td className={className} />;
}

function Active ({ className = '', isRelay, points, sessionInfo, toggleFavorite, validator }: Props): React.ReactElement<Props> {
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
        isRelay={isRelay}
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
        <ActiveExpanded validator={validator} />
      </Bottom>
    </>
  );
}

export default React.memo(Active);
