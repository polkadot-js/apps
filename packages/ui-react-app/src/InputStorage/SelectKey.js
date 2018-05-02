// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key, StateDb$SectionNames } from '@polkadot/storage/types';
import type { BareProps } from '../types';

type Props = BareProps & {
  isError?: boolean,
  onChange?: (event: SyntheticEvent<*>, value: StorageDef$Key) => void,
  subject?: rxjs$Subject<StorageDef$Key>,
  value?: StateDb$SectionNames
};

const React = require('react');
const keys = require('@polkadot/storage-substrate/keys');

const RxDropdown = require('../RxDropdown');
const createOptions = require('./options/key');

module.exports = function SelectKey ({ className, isError, onChange, style, subject, value }: Props): React$Node {
  if (!value || !keys[value]) {
    return null;
  }

  const transform = (name: string): StorageDef$Key =>
    keys[value].keys[name];
  const options = createOptions(value);

  return (
    <RxDropdown
      className={['ui--InputStorage-SelectKey', className].join(' ')}
      isError={isError}
      onChange={onChange}
      options={options}
      style={style}
      subject={subject}
      transform={transform}
    />
  );
};
