// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownOptions } from '../util/types';
import type { ConstValueBase } from './types';

import React from 'react';

import Dropdown from '../Dropdown';
import { classes } from '../util';

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
      className={classes('ui--DropdownLinked-Items', className)}
      isError={isError}
      onChange={onChange}
      options={options}
      transform={transform(props)}
      value={value.method}
      withLabel={false}
    />
  );
}

export default React.memo(SelectKey);
