// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { AddressSmall, Table, Tag } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import useExposure from './useExposure';

interface Props {
  activeEra: BN | null;
  className?: string;
  isFavorite: boolean;
  points?: string;
  stashId: string;
  toggleFavorite: (stashId: string) => void;
}

interface PropsExpanded {
  className?: string;
  stashId: string;
}

function ValidatorExpanded ({ className = '' }: PropsExpanded): React.ReactElement<PropsExpanded> {
  return (
    <tr className={`${className} isExpanded isLast`}>
      <td />
      <td></td>
      <td />
    </tr>
  );
}

function Validator ({ activeEra, className = '', isFavorite, points, stashId, toggleFavorite }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleExpanded] = useToggle();
  const exposure = useExposure(stashId, activeEra);

  const pointsAnimClass = useMemo(
    () => (points && `greyAnim-${Date.now() % 25}`) || '',
    [points]
  );

  return (
    <>
      <tr className={`${className} isExpanded isFirst`}>
        <Table.Column.Favorite
          address={stashId}
          isFavorite={isFavorite}
          toggle={toggleFavorite}
        />
        <td className='address relative all'>
          <AddressSmall value={stashId} />
          {points && (
            <Tag
              className={`${pointsAnimClass} absolute`}
              color='lightgrey'
              label={points}
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
        <ValidatorExpanded stashId={stashId} />
      )}
    </>
  );
}

export default React.memo(Validator);
