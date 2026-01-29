// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, CoreAssignment, GroupIndex, ParaId, ParaValidatorIndex } from '@polkadot/types/interfaces';
import type { ValidatorInfo } from './types.js';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

type MultiResult = [AccountId[] | null, CoreAssignment[] | null, ParaValidatorIndex[][] | null, ParaValidatorIndex[] | null];

type Result = [AccountId[] | null, Record<string, [GroupIndex, ValidatorInfo[]]>];

const optionsMulti = {
  defaultValue: [null, null, null, null] as MultiResult
};

function mapValidators (startWith: Record<string, [GroupIndex, ValidatorInfo[]]>, ids: ParaId[], validators: AccountId[], groups: ParaValidatorIndex[][], indices: ParaValidatorIndex[], scheduled: CoreAssignment[]): Record<string, [GroupIndex, ValidatorInfo[]]> {
  return ids.reduce((all: Record<string, [GroupIndex, ValidatorInfo[]]>, id) => {
    // paraId should never be undefined, since it comes from the state, yet here we are...
    // See https://github.com/polkadot-js/apps/issues/6435
    const assignment = scheduled.find(({ paraId }) => paraId && paraId.eq(id));

    if (!assignment) {
      return all;
    }

    return {
      ...all,
      [id.toString()]: [
        assignment.groupIdx,
        (groups[assignment.groupIdx.toNumber()] || [])
          .map((index) => [index, indices[index.toNumber()]])
          .filter(([, a]) => a)
          .map(([indexActive, indexValidator]) => ({
            indexActive,
            indexValidator,
            validatorId: validators[indexValidator.toNumber()]
          }))
      ]
    };
  }, { ...startWith });
}

function useValidatorsImpl (ids?: ParaId[]): Result {
  const { api } = useApi();
  const [validators, scheduled, groups, indices] = useCallMulti<MultiResult>([
    api.query.session.validators,
    (api.query.parasScheduler || api.query.paraScheduler || api.query.scheduler)?.scheduled,
    (api.query.parasScheduler || api.query.paraScheduler || api.query.scheduler)?.validatorGroups,
    (api.query.parasShared || api.query.paraShared || api.query.shared)?.activeValidatorIndices
  ], optionsMulti);
  const [state, setState] = useState<Record<string, [GroupIndex, ValidatorInfo[]]>>({});

  useEffect((): void => {
    groups && ids && indices && scheduled && validators && setState((prev) =>
      mapValidators(prev, ids, validators, groups, indices, scheduled)
    );
  }, [groups, ids, indices, scheduled, validators]);

  return useMemo(
    (): Result => [validators, state],
    [state, validators]
  );
}

export default createNamedHook('useValidators', useValidatorsImpl);
