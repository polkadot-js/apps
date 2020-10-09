// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { DropdownOptions } from '../util/types';

import React from 'react';

import Dropdown from '../Dropdown';
import { classes } from '../util';

interface Props {
  className?: string;
  defaultValue?: string;
  isError?: boolean;
  onChange: (value: string) => void;
  options: DropdownOptions;
  value: SubmittableExtrinsicFunction<'promise'>;
}

function SelectSection ({ className = '', defaultValue, isError, onChange, options, value }: Props): React.ReactElement<Props> {
  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Sections', className)}
      defaultValue={defaultValue}
      isError={isError}
      onChange={onChange}
      options={options}
      value={value.section}
      withLabel={false}
    />
  );
}

export default React.memo(SelectSection);
