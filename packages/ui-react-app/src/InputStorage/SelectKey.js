// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { BareProps } from '../types';

type Props = BareProps & {
  isError?: boolean,
  label?: string,
  onChange?: (event: SyntheticEvent<*>, value: StorageDef$Key) => void,
  subject?: rxjs$Subject<StorageDef$Key>,
  value?: StorageDef$Key
};

const React = require('react');
const map = require('@polkadot/storage-substrate/keys');

const RxDropdown = require('../RxDropdown');
const createOptions = require('./options/key');

module.exports = function SelectKey ({ className, isError, label, onChange, style, subject, value }: Props): React$Node {
  if (!value || !map[value.section]) {
    return null;
  }

  const keys = map[value.section].keys;
  const transform = (name: string): StorageDef$Key =>
    keys[name];
  const options = createOptions(value.section);

  return (
    <RxDropdown
      className={['ui--InputStorage-SelectKey', className].join(' ')}
      isError={isError}
      label={label}
      onChange={onChange}
      options={options}
      style={style}
      subject={subject}
      transform={transform}
      value={value.name}
    />
  );
};
