// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../types';

import React, { useRef } from 'react';

import Legend from '@polkadot/app-staking/Legend';
import { Table } from '@polkadot/react-components';
import { useLoadingDelay } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import useValidatorsWaiting from '../useValidatorsWaiting';
import ValidatorRow from './Validator';

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
  const isLoading = useLoadingDelay();
  const validatorsWaiting = useValidatorsWaiting(favorites, sessionInfo, validatorsActive);

  const headerWaiting = useRef<[string?, string?, number?][]>([
    // favorite, badges, details, expand
    [t<string>('waiting'), 'start', 4]
  ]);

  return (
    <Table
      className={className}
      empty={!isLoading && validatorsWaiting && t<string>('No waiting validators found')}
      emptySpinner={t<string>('Retrieving waiting validators')}
      header={headerWaiting.current}
      isSplit
      legend={<Legend isRelay={isRelay} />}
    >
      {!isLoading && validatorsWaiting?.map((v) => (
        <ValidatorRow
          isRelay={isRelay}
          key={v.key}
          sessionInfo={sessionInfo}
          toggleFavorite={toggleFavorite}
          validator={v}
        />
      ))}
    </Table>
  );
}

export default React.memo(ListActive);
