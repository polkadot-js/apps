// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallFunction } from '@polkadot/types/types';
import { BareProps } from '../types';
import { DropdownOptions } from '../util/types';

import React from 'react';
import ApiPromise from '@polkadot/api/promise';

import Dropdown from '../Dropdown';
import { classes } from '../util';

interface Props extends BareProps {
  api: ApiPromise;
  isError?: boolean;
  onChange: (value: CallFunction) => void;
  options: DropdownOptions;
  value: CallFunction;
}

export default class SelectMethod extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, isError, onChange, options, style, value } = this.props;

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
        transform={this.transform}
        value={value.method}
        withLabel={false}
      />
    );
  }

  private transform = (method: string): CallFunction => {
    const { api, value } = this.props;

    return api.tx[value.section][method];
  }
}
