// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DefinitionRpcExt } from '@polkadot/types/types';
import type { DropdownOption } from '../util/types';

import React, { useCallback } from 'react';

import Dropdown from '../Dropdown';
import useRpcs from './useRpcs';

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
      className={`ui--DropdownLinked-Items ${className}`}
      isError={isError}
      onChange={onChange}
      options={options}
      transform={_transform}
      value={value.method}
      withLabel={false}
    />
  );
}

export default React.memo(SelectMethod);
