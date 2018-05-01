// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { BareProps } from '../types';

require('./InputStorage.css');

const React = require('react');

const RxDropdown = require('../RxDropdown');
const lookup = require('./lookup');
const options = require('./options');

type Props = BareProps & {
  isError?: boolean,
  onChange?: (event: SyntheticEvent<*>, value: StorageDef$Key) => void,
  subject?: rxjs$Subject<StorageDef$Key>
};

const transform = (value: string): StorageDef$Key =>
  lookup[value];

module.exports = function InputStorage (props: Props): React$Node {
  return (
    <RxDropdown
      {...props}
      className={['ui--InputStorage', props.className].join(' ')}
      options={options}
      transform={transform}
    />
  );
};
