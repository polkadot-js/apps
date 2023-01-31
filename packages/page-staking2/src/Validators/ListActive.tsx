// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../types';
import type { UsePoints } from './types';

import React, { useRef } from 'react';

import Legend from '@polkadot/app-staking/Legend';
import { Table } from '@polkadot/react-components';
import { useNextTick } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import ValidatorRow from './Validator';

interface Props {
  className?: string;
  isRelay: boolean;
  points?: UsePoints;
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
  validatorsActive?: Validator[];
}

function ListActive ({ className = '', isRelay, points, sessionInfo, toggleFavorite, validatorsActive }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const isNextTick = useNextTick();

  const headerActive = useRef<[string?, string?, number?][]>([
    // favorite, badges, details, expand
    [t<string>('validators'), 'start', 4]
  ]);

  return (
    <Table
      className={className}
      empty={isNextTick && validatorsActive && t<string>('No session validators found')}
      emptySpinner={t<string>('Retrieving session validators')}
      header={headerActive.current}
      isSplit
      legend={<Legend isRelay={isRelay} />}
    >
      {isNextTick && validatorsActive?.map((v) => (
        <ValidatorRow
          isRelay={isRelay}
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

export default React.memo(ListActive);
