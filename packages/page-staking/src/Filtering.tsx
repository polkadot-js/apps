// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { Input, Toggle } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

interface Props {
  children?: React.ReactNode;
  className?: string;
  nameFilter: string;
  setNameFilter: (value: string) => void;
  setWithIdentity: (value: boolean) => void;
  withIdentity: boolean;
}

function Filtering ({ children, className, nameFilter, setNameFilter, setWithIdentity, withIdentity }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();

  return (
    <div className={className}>
      <Input
        autoFocus
        isFull
        label={t<string>('filter by name, address or index')}
        onChange={setNameFilter}
        value={nameFilter}
      />
      <div className='staking--optionsBar'>
        {children}
        {api.query.identity && (
          <Toggle
            className='staking--buttonToggle'
            label={t<string>('only with an identity')}
            onChange={setWithIdentity}
            value={withIdentity}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(styled(Filtering)`
  .staking--optionsBar {
    text-align: right;

    .staking--buttonToggle {
      display: inline-block;
      margin-right: 1rem;
      margin-top: 0.5rem;
    }
  }
`);
