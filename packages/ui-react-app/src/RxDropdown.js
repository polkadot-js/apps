// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';
import Label from 'semantic-ui-react/dist/es/elements/Label';

import doChange from './util/doChange';

type Props = BareProps & {
  defaultValue?: string,
  isError?: boolean,
  label?: string,
  // flowlint-next-line unclear-type:off
  onChange?: (value: any) => void | rxjs$Subject<any>,
  // flowlint-next-line unclear-type:off
  transform?: (value: any) => any
};

export default function RxDropdown (props: Props): React$Node {
  const onChange = (event: SyntheticEvent<*>, { value }): void => {
    const _value = props.transform
      ? props.transform(value)
      : value;

    doChange(_value, props.onChange);
  };

  const _props = {...props};

  delete _props.isError;
  delete _props.label;
  delete _props.onChange;
  delete _props.transform;

  return [
    <Label key='label'>
      {props.label || ''}
    </Label>,
    <Dropdown
      key='dropdown'
      selection
      {..._props}
      className={props.className}
      error={props.isError}
      onChange={onChange}
    />
  ];
}
