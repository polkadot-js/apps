// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { QueryableStorageEntry } from '@polkadot/api/types';
import { DropdownOptions } from '../util/types';

import React from 'react';

import Dropdown from '../Dropdown';
import { classes } from '../util';

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
      className={classes('ui--DropdownLinked-Sections', className)}
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
