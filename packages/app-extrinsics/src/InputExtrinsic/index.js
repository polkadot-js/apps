// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: This is a useful, shared component, move out

import './InputExtrinsic.css';

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';

import options from './options';

type Props = {
  className?: string,
  isPrivate?: boolean,
  onChange?: (event: SyntheticEvent<*>, value: Uint8Array) => void,
  style?: {
    [string]: string
  },
  subject?: rxjs$Subject<*>
};

export default function InputExtrinsic (props: Props): React$Node {
  // eslint-disable-next-line no-unused-vars
  const onChange = (event: SyntheticEvent<*>, { value }): void => {
    if (props.subject) {
      props.subject.next(value);
    }

    if (props.onChange) {
      props.onChange(event, value);
    }
  };

  return (
    <Dropdown
      selection
      {...props}
      className={['ui--InputExtrinsic', props.className].join(' ')}
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
