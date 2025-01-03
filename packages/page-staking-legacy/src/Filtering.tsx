// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import queryString from 'query-string';
import React, { useCallback, useEffect } from 'react';

import { Input, Toggle } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { isString } from '@polkadot/util';

import { useTranslation } from './translate.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  nameFilter: string;
  setNameFilter: (value: string, isQuery: boolean) => void;
  setWithIdentity?: (value: boolean) => void;
  withIdentity?: boolean;
}

function Filtering ({ children, className, nameFilter, setNameFilter, setWithIdentity, withIdentity }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { apiIdentity } = useApi();

  // on load, parse the query string and extract the filter
  useEffect((): void => {
    const queryFilter = queryString.parse(location.href.split('?')[1]).filter;

    if (isString(queryFilter)) {
      setNameFilter(queryFilter, true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _setNameFilter = useCallback(
    (value: string) => setNameFilter(value, false),
    [setNameFilter]
  );

  return (
    <div className={className}>
      <Input
        autoFocus
        isFull
        label={t('filter by name, address or index')}
        onChange={_setNameFilter}
        value={nameFilter}
      />
      {(children || setWithIdentity) && (
        <div className='staking--optionsBar'>
          {children}
          {setWithIdentity && apiIdentity.query.identity && (
            <Toggle
              className='staking--buttonToggle'
              label={t('with an identity')}
              onChange={setWithIdentity}
              value={withIdentity}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(Filtering);
