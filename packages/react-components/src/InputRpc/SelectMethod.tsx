// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefinitionRpcExt } from '@polkadot/types/types';
import { DropdownOptions } from '@canvas-ui/react-util/types';
import { BareProps } from '../types';

import React from 'react';

import jsonrpc from '@polkadot/types/interfaces/jsonrpc';

import Dropdown from '../Dropdown';
import { classes } from '@canvas-ui/react-util';

interface Props extends BareProps {
  isError?: boolean;
  onChange: (value: DefinitionRpcExt) => void;
  options: DropdownOptions;
  value: DefinitionRpcExt;
}

function transform ({ value: { section } }: Props): (method: string) => DefinitionRpcExt {
  return function (method: string): DefinitionRpcExt {
    return jsonrpc[section][method];
  };
}

function SelectMethod (props: Props): React.ReactElement<Props> | null {
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

export default React.memo(SelectMethod);
