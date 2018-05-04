// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Section$Item } from '@polkadot/section/item';
import type { BareProps } from '../types';

import React from 'react';

import RxDropdown from '../RxDropdown';

type Props = BareProps & {
  createOptions: (section: string) => Array<*>,
  isError?: boolean,
  label?: string,
  onChange?: (event: SyntheticEvent<*>, value: Section$Item) => void,
  subject?: rxjs$Subject<Section$Item>,
  value?: Section$Item
};

export default function SelectItems ({ className, createOptions, isError, label = '', onChange, style, subject, t, type, value: { name, section } = {} }: Props): React$Node {
  if (!section) {
    return null;
  }

  const options = createOptions(section);
  const transform = (name: string): Section$Item =>
    options
      .filter(({ value }) => value === name)
      .map(({ expanded }) => expanded)[0];

  return (
    <RxDropdown
      className={['ui--RxDropdownLinked-Items', className].join(' ')}
      isError={isError}
      label={label}
      onChange={onChange}
      options={options}
      style={style}
      subject={subject}
      transform={transform}
      value={name}
    />
  );
}
