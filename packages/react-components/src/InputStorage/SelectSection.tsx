// Copyright 2017-2024 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueryableStorageEntry } from '@polkadot/api/types';
import type { DropdownOptions } from '../util/types.js';

import React from 'react';

import Dropdown from '../Dropdown.js';

interface Props {
  className?: string;
  defaultValue?: QueryableStorageEntry<'promise'>;
  isError?: boolean;
  onChange: (value: string) => void;
  options: DropdownOptions;
  value: QueryableStorageEntry<'promise'>;
  searchable?: boolean
}

function SelectSection ({ className = '', defaultValue, isError, onChange, options, searchable = false, value: { creator: { section } } }: Props): React.ReactElement<Props> {
  return (
    <Dropdown
      className={`${className} ui--DropdownLinked-Sections`}
      defaultValue={defaultValue}
      isError={isError}
      onChange={onChange}
      options={options}
      searchable={searchable}
      value={section}
      withLabel={false}
    />
  );
}

export default React.memo(SelectSection);
