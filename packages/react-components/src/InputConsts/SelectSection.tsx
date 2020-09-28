// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DropdownOptions } from '../util/types';
import { ConstValueBase, StorageEntryPromise } from './types';

import React from 'react';

import Dropdown from '../Dropdown';
import { classes } from '../util';

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
