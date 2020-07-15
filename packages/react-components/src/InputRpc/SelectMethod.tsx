// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DefinitionRpcExt } from '@polkadot/types/types';
import { DropdownOptions } from '../util/types';

import React from 'react';

import jsonrpc from '@polkadot/types/interfaces/jsonrpc';

import Dropdown from '../Dropdown';
import { classes } from '../util';

interface Props {
  className?: string;
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
