// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreInfo } from '../types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Dropdown, Input, styled } from '@polkadot/react-components';
import { useDebounce } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

const StyledDiv = styled.div`
  @media (max-width: 768px) {
    max-width: 100%:
  }
`;

interface Props {
  data: CoreInfo[];
  onFilter: (data: CoreInfo[]) => void
}

const filterLoad = (parachainId: string, data: CoreInfo[], workloadCoreSelected: number): CoreInfo[] => {
  if (parachainId) {
    return data.filter(({ workload, workplan }) => !!workload?.filter(({ info }) => info.task === parachainId).length || !!workplan?.filter(({ info }) => info.task === parachainId).length);
  }

  if (workloadCoreSelected === -1) {
    return data;
  }

  return data.filter((one) => one.core === workloadCoreSelected);
};

function Filters ({ data, onFilter }: Props): React.ReactElement<Props> {
  const [workloadCoreSelected, setWorkloadCoreSelected] = useState(-1);
  const [_parachainId, setParachainId] = useState<string>('');

  const coreArr: number[] = useMemo(() =>
    data?.length
      ? Array.from({ length: data.length || 0 }, (_, index) => index)
      : []
  , [data]);

  const { t } = useTranslation();
  const parachainId = useDebounce(_parachainId);

  const workloadCoreOpts = useMemo(
    () => coreArr && [{ text: t('All active/available cores'), value: -1 }].concat(
      coreArr
        .map((c) => (
          {
            text: `Core ${c}`,
            value: c
          }
        ))
        .filter((v): v is { text: string, value: number } => !!v.text)
    ),
    [coreArr, t]
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    const filtered = filterLoad(parachainId, data, workloadCoreSelected);

    onFilter(filtered);
  }, [data, workloadCoreSelected, parachainId, onFilter]);

  const onDropDownChange = useCallback((v: number) => {
    setWorkloadCoreSelected(v);
    setParachainId('');
  }, []);

  const onInputChange = useCallback((v: string) => {
    setParachainId(v);
    setWorkloadCoreSelected(-1);
  }, []);

  return (
    <StyledDiv style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxWidth: '300px' }}>
      <Dropdown
        className='isSmall'
        label={t('selected core')}
        onChange={onDropDownChange}
        options={workloadCoreOpts}
        value={workloadCoreSelected}
      />
      <div style={{ minWidth: '150px' }}>
        <Input
          className='full isSmall'
          label={t('parachain id')}
          onChange={onInputChange}
          placeholder={t('parachain id')}
          value={_parachainId}
        />
      </div>
    </StyledDiv>

  );
}

export default React.memo(Filters);
