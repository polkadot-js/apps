// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../types';

import React, { useRef } from 'react';

import Legend from '@polkadot/app-staking/Legend';
import { Table } from '@polkadot/react-components';
import { useNextTick } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import useValidatorsWaiting from '../useValidatorsWaiting';
import Waiting from './Waiting';

interface Props {
  className?: string;
  favorites: string[];
  isRelay: boolean;
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
  validatorsActive?: Validator[];
}

function ListActive ({ className = '', favorites, isRelay, sessionInfo, toggleFavorite, validatorsActive }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const isNextTick = useNextTick();
  const validatorsWaiting = useValidatorsWaiting(favorites, sessionInfo, validatorsActive);

  const header = useRef<[string?, string?, number?][]>([
    // favorite, badges, details, expand
    [t<string>('waiting'), 'start', 4]
  ]);

  return (
    <Table
      className={className}
      empty={isNextTick && validatorsWaiting && t<string>('No waiting validators found')}
      emptySpinner={t<string>('Retrieving waiting validators')}
      header={header.current}
      isSplit
      legend={<Legend isRelay={isRelay} />}
    >
      {isNextTick && validatorsWaiting?.map((v) => (
        <Waiting
          key={v.key}
          toggleFavorite={toggleFavorite}
          validator={v}
        />
      ))}
    </Table>
  );
}

export default React.memo(ListActive);
