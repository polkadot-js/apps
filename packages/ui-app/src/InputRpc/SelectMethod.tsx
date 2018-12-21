// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';

import React from 'react';

import map from '@polkadot/jsonrpc';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  isError?: boolean,
  label?: string,
  onChange: (value: RpcMethod) => void,
  options: DropdownOptions,
  value: RpcMethod,
  withLabel?: boolean
};

class SelectMethod extends React.PureComponent<Props> {
  render () {
    const { className, isError, label = '', onChange, options, style, t, value, withLabel } = this.props;

    if (!options.length) {
      return null;
    }

    const transform = (method: string): RpcMethod =>
      map[value.section].methods[method];

    return (
      <Dropdown
        className={classes('ui--DropdownLinked-Items', className)}
        isError={isError}
        label={label || t('input.rpc.method', {
          defaultValue: 'with method name'
        })}
        onChange={onChange}
        options={options}
        style={style}
        transform={transform}
        value={value.method}
        withLabel={withLabel}
      />
    );
  }
}

export default translate(SelectMethod);
