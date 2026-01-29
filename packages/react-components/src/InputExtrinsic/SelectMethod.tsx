// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { DropdownOptions } from '../util/types.js';

import React, { useCallback } from 'react';

import Dropdown from '../Dropdown.js';
import { filterDropdownItems } from '../util/index.js';

interface Props {
  api: ApiPromise;
  className?: string;
  defaultValue?: string;
  isDisabled?: boolean;
  isError?: boolean;
  onChange?: (value: SubmittableExtrinsicFunction<'promise'>) => void;
  options: DropdownOptions;
  value: SubmittableExtrinsicFunction<'promise'>;
}

function SelectMethod ({ api, className = '', defaultValue, isDisabled, isError, onChange, options, value }: Props): React.ReactElement<Props> | null {
  const transform = useCallback(
    (method: string): SubmittableExtrinsicFunction<'promise'> =>
      api.tx[value.section][method],
    [api, value]
  );

  if (!options.length) {
    return null;
  }

  return (
    <Dropdown
      className={`${className} ui--DropdownLinked-Items`}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      onChange={onChange}
      onSearch={filterDropdownItems}
      options={options}
      transform={transform}
      value={value.method}
      withLabel={false}
    />
  );
}

export default React.memo(SelectMethod);
