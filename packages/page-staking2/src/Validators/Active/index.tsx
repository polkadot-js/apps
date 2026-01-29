// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../../types.js';
import type { UsePoints } from '../types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useNextTick } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';
import Entry from './Entry.js';

interface Props {
  className?: string;
  legend: React.ReactNode;
  points?: UsePoints;
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
  validatorsActive?: Validator[];
}

function Active ({ className = '', legend, points, sessionInfo, toggleFavorite, validatorsActive }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const isNextTick = useNextTick();

  const header = useRef<[string?, string?, number?][]>([
    // favorite, badges, details, expand
    [t('validators'), 'start', 4]
  ]);

  return (
    <Table
      className={className}
      empty={isNextTick && validatorsActive && t('No session validators found')}
      emptySpinner={t('Retrieving session validators')}
      header={header.current}
      isSplit
      legend={legend}
    >
      {isNextTick && validatorsActive?.map((v) => (
        <Entry
          key={v.key}
          points={points?.[v.stashId]}
          sessionInfo={sessionInfo}
          toggleFavorite={toggleFavorite}
          validator={v}
        />
      ))}
    </Table>
  );
}

export default React.memo(Active);
