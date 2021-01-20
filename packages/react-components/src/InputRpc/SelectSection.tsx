// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { classes } from '@canvas-ui/react-util';
import { DropdownOptions } from '@canvas-ui/react-util/types';
import React from 'react';

import { DefinitionRpcExt } from '@polkadot/types/types';

import Dropdown from '../Dropdown';
import { BareProps } from '../types';

interface Props extends BareProps {
  defaultValue?: string;
  isError?: boolean;
  onChange: (value: string) => void;
  options: DropdownOptions;
  value: DefinitionRpcExt;
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
