// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { Input } from '@polkadot/react-components/index';

interface Props {
  className?: string;
  filterOn: string;
  label: string;
  setFilter: (filter: string) => void;
}

function Filter ({ className = '', filterOn, label, setFilter }: Props) {
  return (
    <div className={`${className} filter--tags`}>
      <Input
        autoFocus
        isFull
        label={label}
        onChange={setFilter}
        value={filterOn}
      />
    </div>
  );
}

export default React.memo(styled(Filter)`
  width: 17.857rem;

  :not(:only-child) {
    margin-left: 2.286rem;
  }
  .ui--Input {
    height: 3.893rem;
  }
`);
