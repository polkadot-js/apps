// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { DropdownOptions } from '../util/types';

import React from 'react';

import Dropdown from '../Dropdown';

interface Props {
  className?: string;
  defaultValue?: string;
  isDisabled?: boolean;
  isError?: boolean;
  onChange?: (value: string) => void;
  options: DropdownOptions;
  value: SubmittableExtrinsicFunction<'promise'>;
}

function SelectSection ({ className = '', defaultValue, isDisabled, isError, onChange, options, value }: Props): React.ReactElement<Props> {
  return (
    <Dropdown
      className={`ui--DropdownLinked-Sections ${className}`}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      onChange={onChange}
      options={options}
      value={value.section}
      withLabel={false}
    />
  );
}

export default React.memo(SelectSection);
