// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: This is a useful, shared component, move out

import type { Extrinsic } from '@polkadot/extrinsics/types';

import './InputExtrinsic.css';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';
import extrinsics from '@polkadot/extrinsics-polkadot/src';

import options from './options';

type Props = {
  className?: string,
  isError?: boolean,
  isPrivate?: boolean,
  onChange?: (event: SyntheticEvent<*>, value: Extrinsic) => void,
  style?: {
    [string]: string
  },
  subject?: rxjs$Subject<Extrinsic>
};

export default function InputExtrinsic (props: Props): React$Node {
  // eslint-disable-next-line no-unused-vars
  const onChange = (event: SyntheticEvent<*>, { value }): void => {
    const extrinsic = extrinsics.get(value);

    if (props.subject) {
      props.subject.next(extrinsic);
    }

    if (props.onChange) {
      props.onChange(event, extrinsic);
    }
  };

  const _props = Object.assign({}, props);

  delete _props.isError;
  delete _props.isPrivate;

  return (
    <Dropdown
      selection
      {..._props}
      className={['ui--InputExtrinsic', props.className].join(' ')}
      error={props.isError}
      onChange={onChange}
      options={
        // flowlint-next-line sketchy-null-bool:off
        props.isPrivate
          ? options.private
          : options.public
      }
    />
  );
}
