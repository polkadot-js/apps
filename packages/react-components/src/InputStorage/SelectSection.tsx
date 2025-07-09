// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueryableStorageEntry } from '@polkadot/api/types';
import type { DropdownOptions } from '../util/types.js';

import React from 'react';

import Dropdown from '../Dropdown.js';
import { filterDropdownItems } from '../util/index.js';

interface Props {
  className?: string;
  defaultValue?: QueryableStorageEntry<'promise'>;
  isError?: boolean;
  onChange: (value: string) => void;
  options: DropdownOptions;
  value: QueryableStorageEntry<'promise'>;
}

function SelectSection ({ className = '', defaultValue, isError, onChange, options, value: { creator: { section } } }: Props): React.ReactElement<Props> {
  return (
    <Dropdown
      className={`${className} ui--DropdownLinked-Sections`}
      defaultValue={defaultValue}
      isError={isError}
      onChange={onChange}
      onSearch={filterDropdownItems}
      options={options}
      value={section}
      withLabel={false}
    />
  );
}

export default React.memo(SelectSection);
