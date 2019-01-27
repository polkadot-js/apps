// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { DropdownOptions } from '../util/types';
import { BareProps } from '../types';

import React from 'react';

import map from '@polkadot/jsonrpc';

import Dropdown from '../Dropdown';
import classes from '../util/classes';

type Props = BareProps & {
  isError?: boolean,
  onChange: (value: RpcMethod) => void,
  options: DropdownOptions,
  value: RpcMethod
};

export default class SelectMethod extends React.PureComponent<Props> {
  render () {
    const { className, isError, onChange, options, style, value } = this.props;

    if (!options.length) {
      return null;
    }

    const transform = (method: string): RpcMethod =>
      map[value.section].methods[method];

    return (
      <Dropdown
        className={classes('ui--DropdownLinked-Items', className)}
        isError={isError}
        onChange={onChange}
        options={options}
        style={style}
        transform={transform}
        value={value.method}
        withLabel={false}
      />
    );
  }
}
