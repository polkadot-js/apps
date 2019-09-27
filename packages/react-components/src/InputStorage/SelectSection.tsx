// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DropdownOptions } from '../util/types';
import { BareProps } from '../types';
import { StorageEntryPromise } from './types';

import React from 'react';

import Dropdown from '../Dropdown';
import { classes } from '../util';

interface Props extends BareProps {
  defaultValue?: StorageEntryPromise;
  isError?: boolean;
  onChange: (value: string) => void;
  options: DropdownOptions;
  value: StorageEntryPromise;
}

export default function SelectSection ({ className, defaultValue, isError, onChange, options, style, value: { creator: { section } } }: Props): React.ReactElement<Props> {
  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Sections', className)}
      defaultValue={defaultValue}
      isError={isError}
      onChange={onChange}
      options={options}
      style={style}
      value={section}
      withLabel={false}
    />
  );
}
