// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { NominatedBy as NominatedByType } from '@polkadot/app-staking/types';
import type { SlashingSpans } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { AddressMini, ExpanderScroll } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate.js';

interface Props {
  nominators?: NominatedByType[];
  slashingSpans?: SlashingSpans | null;
}

interface Chilled {
  active: null | [number, () => React.ReactNode[]];
  chilled: null | [number, () => React.ReactNode[]];
}

function extractFunction (all: string[]): null | [number, () => React.ReactNode[]] {
  return all.length
    ? [
      all.length,
      () => all.map((value): React.ReactNode =>
        <AddressMini
          key={value}
          value={value}
        />
      )
    ]
    : null;
}

function extractChilled (api: ApiPromise, nominators: NominatedByType[] = [], slashingSpans?: SlashingSpans | null): Chilled {
  // NOTE With the introduction of the SlashReported event,
  // nominators are not auto-chilled on validator slash
  const chilled = slashingSpans && !api.events.staking.SlashReported
    ? nominators
      .filter(({ submittedIn }) =>
        slashingSpans.lastNonzeroSlash.gt(submittedIn)
      )
      .map(({ nominatorId }) => nominatorId)
    : [];

  return {
    active: extractFunction(
      nominators
        .filter(({ nominatorId }) => !chilled.includes(nominatorId))
        .map(({ nominatorId }) => nominatorId)
    ),
    chilled: extractFunction(chilled)
  };
}

function NominatedBy ({ nominators, slashingSpans }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const { active, chilled } = useMemo(
    () => extractChilled(api, nominators, slashingSpans),
    [api, nominators, slashingSpans]
  );

  return (
    <td className='expand all'>
      {active && (
        <ExpanderScroll
          renderChildren={active[1]}
          summary={t('Nominations ({{count}})', { replace: { count: formatNumber(active[0]) } })}
        />
      )}
      {chilled && (
        <ExpanderScroll
          renderChildren={chilled[1]}
          summary={t('Renomination required ({{count}})', { replace: { count: formatNumber(chilled[0]) } })}
        />
      )}
    </td>
  );
}

export default React.memo(NominatedBy);
