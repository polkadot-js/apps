// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkload, CoreWorkplan } from '@polkadot/react-hooks/types';

import React, { useEffect, useMemo, useState } from 'react';

import { Dropdown, Input, styled } from '@polkadot/react-components';
import { useDebounce } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

const StyledDiv = styled.div`
  @media (max-width: 768px) {
    max-width: 100%:
  }
`;

interface Props {
  workLoad?: CoreWorkload[];
  onFilter: (data: CoreWorkload[]) => void
}

const filterLoad = (parachainId: string, load: CoreWorkload[] | CoreWorkplan[], workloadCoreSelected: number) => {
  if (parachainId) {
    return load?.filter(({ info }) => info.task === parachainId);
  }

  if (workloadCoreSelected === -1) {
    return load;
  }

  return load?.filter(({ core }) => core === workloadCoreSelected);
};

function Filters ({ onFilter, workLoad }: Props): React.ReactElement<Props> {
  const [workloadCoreSelected, setWorkloadCoreSelected] = useState(-1);
  const [_parachainId, setParachainId] = useState<string>('');
  const [coreArr, setCoreArr] = useState<number[]>([]);

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
    if (!coreArr.length && !!workLoad?.length) {
      const newCoreArr = Array.from({ length: workLoad?.length || 0 }, (_, index) => index);

      setCoreArr(newCoreArr);
    }
  }, [workLoad, coreArr]);

  useEffect(() => {
    if (!workLoad) {
      return;
    }

    const filtered = filterLoad(parachainId, workLoad, workloadCoreSelected);

    onFilter(filtered);
  }, [workLoad, workloadCoreSelected, parachainId, onFilter]);

  function onDropDownChange (v: number) {
    setWorkloadCoreSelected(v);
    setParachainId('');
  }

  function onInputChange (v: string) {
    setParachainId(v);
    setWorkloadCoreSelected(-1);
  }

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
