// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { DropdownOptions } from '../util/types';
import { BareProps } from '../types';

import React from 'react';

import map from '@polkadot/jsonrpc';

import Dropdown from '../Dropdown';
import { classes } from '../util';

interface Props extends BareProps {
  isError?: boolean;
  onChange: (value: RpcMethod) => void;
  options: DropdownOptions;
  value: RpcMethod;
}

function transform ({ value }: Props): (method: string) => RpcMethod {
  return function (method: string): RpcMethod {
    return map[value.section].methods[method];
  };
}

export default function SelectMethod (props: Props): React.ReactElement<Props> | null {
  const { className, isError, onChange, options, style, value } = props;

  if (!options.length) {
    return null;
  }

  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Items', className)}
      isError={isError}
      onChange={onChange}
      options={options}
      style={style}
      transform={transform(props)}
      value={value.method}
      withLabel={false}
    />
  );
}
