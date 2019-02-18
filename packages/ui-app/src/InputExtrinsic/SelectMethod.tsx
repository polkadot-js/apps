// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MethodFunction } from '@polkadot/types/Method';
import { BareProps } from '../types';
import { DropdownOptions } from '../util/types';

import React from 'react';
import ApiPromise from '@polkadot/api/promise';

import Dropdown from '../Dropdown';
import { classes } from '../util';

type Props = BareProps & {
  api: ApiPromise,
  isError?: boolean,
  onChange: (value: MethodFunction) => void,
  options: DropdownOptions,
  value: MethodFunction
};

export default class SelectMethod extends React.PureComponent<Props> {
  render () {
    const { api, className, isError, onChange, options, style, value } = this.props;

    if (!options.length) {
      return null;
    }

    const transform = (method: string): MethodFunction =>
      api.tx[value.section][method];

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
