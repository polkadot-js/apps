// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { DropdownOptions } from '../util/types';
import { BareProps } from '../types';
import { Value } from './types';

import React from 'react';
import { withApi } from '@polkadot/ui-api';

import Dropdown from '../Dropdown';
import { classes } from '../util';

type Props = ApiProps & BareProps & {
  isError?: boolean;
  onChange: (value: Value) => void;
  options: DropdownOptions;
  value: Value;
};

class SelectKey extends React.PureComponent<Props> {
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

  private transform = (method: string): Value => {
    const { value } = this.props;

    return { method, section: value.section };
  }
}

export default withApi(SelectKey);
