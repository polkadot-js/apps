// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { BareProps } from '../types';

require('./InputExtrinsic.css');

const React = require('react');
const extrinsics = require('@polkadot/extrinsics-polkadot/src');

const RxDropdown = require('../RxDropdown');
const options = require('./options');

type Props = BareProps & {
  isError?: boolean,
  isPrivate?: boolean,
  onChange?: (event: SyntheticEvent<*>, value: Extrinsic) => void,
  subject?: rxjs$Subject<Extrinsic>
};

const transform = (value: string): Extrinsic =>
  extrinsics.get(value);

module.exports = function InputExtrinsic (props: Props): React$Node {
  const _props = {...props};

  delete _props.isPrivate;

  return (
    <RxDropdown
      {..._props}
      className={['ui--InputExtrinsic', props.className].join(' ')}
      options={
        // flowlint-next-line sketchy-null-bool:off
        props.isPrivate
          ? options.private
          : options.public
      }
      transform={transform}
    />
  );
};
