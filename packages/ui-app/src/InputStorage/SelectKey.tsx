// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { DropdownOptions } from '../util/types';
import { BareProps } from '../types';

import React from 'react';
import { StorageFunction } from '@polkadot/types/StorageKey';
import { withApi } from '@polkadot/ui-api/index';

import Dropdown from '../Dropdown';
import classes from '../util/classes';

type Props = ApiProps & BareProps & {
  isError?: boolean,
  onChange: (value: StorageFunction) => void,
  options: DropdownOptions,
  value: StorageFunction
};

class SelectKey extends React.PureComponent<Props> {
  render () {
    const { api, className, isError, onChange, options, style, value } = this.props;

    if (!options.length) {
      return null;
    }

    const transform = (method: string): StorageFunction =>
      api.query[value.section][method];

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

export default withApi(SelectKey);
