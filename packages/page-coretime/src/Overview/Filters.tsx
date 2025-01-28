// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { Input } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

interface Props {
  data: any[];
  onFilter: (data: any[]) => void
}

function Filters ({ data, onFilter }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const onInputChange = useCallback((v: string) => {
    setSearchValue(v);

    if (!v.trim()) {
      onFilter(data);

      return;
    }

    const filteredData = data.filter((item: any) =>
      item.toString().toLowerCase().includes(v.toLowerCase())
    );

    if (!filteredData.length) {
      onFilter([]);

      return;
    }

    onFilter(filteredData);
  }, [data, onFilter]);

  return (
    <div>
      <div style={{ maxWidth: '250px' }}>
        <Input
          className='full isSmall'
          label={t('Search by parachain id or name')}
          onChange={onInputChange}
          placeholder={t('parachain id or name')}
          value={searchValue}
        />
      </div>
    </div>);
}

export default Filters;
