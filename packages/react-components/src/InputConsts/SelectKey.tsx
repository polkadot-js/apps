// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownOptions } from '../util/types.js';
import type { ConstValueBase } from './types.js';

import React from 'react';

import Dropdown from '../Dropdown.js';
import { filterDropdownItems } from '../util/index.js';

interface Props {
  className?: string;
  isError?: boolean;
  onChange: (value: ConstValueBase) => void;
  options: DropdownOptions;
  value: ConstValueBase;
}

function transform ({ value }: Props): (method: string) => ConstValueBase {
  return (method: string): ConstValueBase => {
    const section = value.section;

    return {
      method,
      section
    };
  };
}

function SelectKey (props: Props): React.ReactElement<Props> | null {
  const { className = '', isError, onChange, options, value } = props;

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
      transform={transform(props)}
      value={value.method}
      withLabel={false}
    />
  );
}

export default React.memo(SelectKey);
