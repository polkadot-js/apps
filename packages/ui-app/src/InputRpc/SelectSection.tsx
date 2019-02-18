// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { DropdownOptions } from '../util/types';
import { BareProps } from '../types';

import React from 'react';

import Dropdown from '../Dropdown';
import { classes } from '../util';

type Props = BareProps & {
  defaultValue?: string,
  isError?: boolean,
  onChange: (value: string) => void,
  options: DropdownOptions,
  value: RpcMethod
};

export default class SelectSection extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isError, onChange, options, style, value } = this.props;

    return (
      <Dropdown
        className={classes('ui--DropdownLinked-Sections', className)}
        defaultValue={defaultValue}
        isError={isError}
        onChange={onChange}
        options={options}
        style={style}
        value={value.section}
        withLabel={false}
      />
    );
  }
}
