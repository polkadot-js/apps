// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DefinitionCallNamed } from '@polkadot/types/types';
import type { DropdownOption } from '../util/types';

import React, { useCallback } from 'react';

import Dropdown from '../Dropdown';

interface Props {
  className?: string;
  defs: Record<string, Record<string, DefinitionCallNamed>>;
  isError?: boolean;
  onChange: (value: DefinitionCallNamed) => void;
  options: DropdownOption[];
  value: DefinitionCallNamed;
}

function SelectMethod ({ className = '', defs, isError, onChange, options, value }: Props): React.ReactElement<Props> | null {
  const _transform = useCallback(
    (method: string) => defs[value.section][method],
    [defs, value]
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
