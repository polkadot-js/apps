// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { InterfaceMethodDefinition } from '@polkadot/jsonrpc/types';
import type { I18nProps } from '../types';

import React from 'react';

import map from '@polkadot/jsonrpc';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  isError?: boolean,
  label?: string,
  onChange: (value: InterfaceMethodDefinition) => void,
  // flowlint-next-line unclear-type:off
  options: Array<any>,
  value: InterfaceMethodDefinition,
  withLabel?: boolean
};

function SelectMethod ({ className, isError, label = '', onChange, options, style, t, value: { name, section }, withLabel }: Props): React$Node {
  if (!options.length) {
    return null;
  }

  const transform = (name: string): InterfaceMethodDefinition =>
    // $FlowFixMe ... string to type :(
    map[section].methods[name];

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

export default translate(SelectMethod);
