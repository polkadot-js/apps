// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';
import Label from 'semantic-ui-react/dist/es/elements/Label';

type Props = BareProps & {
  defaultValue?: string,
  isError?: boolean,
  label?: string,
  // flowlint-next-line unclear-type:off
  onChange?: (event: SyntheticEvent<*>, value: any) => void,
  subject?: rxjs$Subject<*>,
  // flowlint-next-line unclear-type:off
  transform?: (value: any) => any
};

export default function RxDropdown (props: Props): React$Node {
  const onChange = (event: SyntheticEvent<*>, { value }): void => {
    const _value = props.transform
      ? props.transform(value)
      : value;

    if (props.subject) {
      props.subject.next(_value);
    }

    if (props.onChange) {
      props.onChange(event, _value);
    }
  };

  const _props = {...props};

  delete _props.isError;
  delete _props.label;
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
