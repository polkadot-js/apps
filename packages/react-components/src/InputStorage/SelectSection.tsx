// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueryableStorageEntry } from '@polkadot/api/types';
import type { DropdownOptions } from '../util/types';

import React from 'react';

import Dropdown from '../Dropdown';

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
      className={`ui--DropdownLinked-Sections ${className}`}
      defaultValue={defaultValue}
      isError={isError}
      onChange={onChange}
      options={options}
      value={section}
      withLabel={false}
    />
  );
}

export default React.memo(SelectSection);
