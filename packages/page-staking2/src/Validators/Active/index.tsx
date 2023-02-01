// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../../types';
import type { UsePoints } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useNextTick } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import Entry from './Entry';

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
    [t<string>('validators'), 'start', 4]
  ]);

  return (
    <Table
      className={className}
      empty={isNextTick && validatorsActive && t<string>('No session validators found')}
      emptySpinner={t<string>('Retrieving session validators')}
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
