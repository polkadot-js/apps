// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DefinitionRpcExt } from '@polkadot/types/types';
import type { DropdownOption } from '../util/types.js';

import React, { useCallback } from 'react';

import Dropdown from '../Dropdown.js';
import { filterDropdownItems } from '../util/index.js';
import useRpcs from './useRpcs.js';

interface Props {
  className?: string;
  isError?: boolean;
  onChange: (value: DefinitionRpcExt) => void;
  options: DropdownOption[];
  value: DefinitionRpcExt;
}

function SelectMethod ({ className = '', isError, onChange, options, value }: Props): React.ReactElement<Props> | null {
  const rpcs = useRpcs();

  const _transform = useCallback(
    (method: string) => rpcs[value.section][method],
    [rpcs, value]
  );

  if (!options.length) {
    return null;
  }

  return (
    <Dropdown
      className={`${className} ui--DropdownLinked-Items`}
      isError={isError}
      onChange={onChange}
      onSearch={filterDropdownItems}
      options={options}
      transform={_transform}
      value={value.method}
      withLabel={false}
    />
  );
}

export default React.memo(SelectMethod);
