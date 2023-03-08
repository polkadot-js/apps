// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownOptions } from '../util/types';
import type { ConstValueBase, StorageEntryPromise } from './types.js';

import React from 'react';

import Dropdown from '../Dropdown.js';

interface Props {
  className?: string;
  defaultValue?: StorageEntryPromise;
  isError?: boolean;
  onChange: (value: string) => void;
  options: DropdownOptions;
  value: ConstValueBase;
}

function SelectSection ({ className = '', defaultValue, isError, onChange, options, value: { section } }: Props): React.ReactElement<Props> {
  return (
    <Dropdown
      className={`${className} ui--DropdownLinked-Sections`}
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
