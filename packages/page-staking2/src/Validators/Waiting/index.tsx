// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../../types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useNextTick } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';
import useValidatorsWaiting from '../../useValidatorsWaiting.js';
import Entry from './Entry.js';

interface Props {
  className?: string;
  favorites: string[];
  legend: React.ReactNode;
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
  validatorsActive?: Validator[];
}

function Waiting ({ className = '', favorites, legend, sessionInfo, toggleFavorite, validatorsActive }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const isNextTick = useNextTick();
  const validatorsWaiting = useValidatorsWaiting(favorites, sessionInfo, validatorsActive);

  const header = useRef<[string?, string?, number?][]>([
    // favorite, badges, details, expand
    [t('waiting'), 'start', 4]
  ]);

  return (
    <Table
      className={className}
      empty={isNextTick && validatorsWaiting && t('No waiting validators found')}
      emptySpinner={t('Retrieving waiting validators')}
      header={header.current}
      isSplit
      legend={legend}
    >
      {isNextTick && validatorsWaiting?.map((v) => (
        <Entry
          key={v.key}
          toggleFavorite={toggleFavorite}
          validator={v}
        />
      ))}
    </Table>
  );
}

export default React.memo(Waiting);
