// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Method } from '@polkadot/jsonrpc/types';
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
  onChange: (value: Method) => void,
  options: DropdownOptions,
  value: Method,
  withLabel?: boolean
};

class SelectMethod extends React.PureComponent<Props> {
  render () {
    const { className, isError, label = '', onChange, options, style, t, value, withLabel } = this.props;

    if (!options.length) {
      return null;
    }

    const transform = (name: string): Method =>
      // @ts-ignore This whole map -> section.method typing...
      map[value.section][name];

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
        value={name}
        withLabel={withLabel}
      />
    );
  }
}

export default translate(SelectMethod);
