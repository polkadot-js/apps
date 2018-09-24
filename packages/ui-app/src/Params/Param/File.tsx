// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';

import InputFile from '../../InputFile';
import Bare from './Bare';

type Props = BareProps & {
  isDisabled?: boolean,
  isError?: boolean,
  label: string,
  onChange?: (contents: Uint8Array) => void,
  placeholder?: string,
  withLabel?: boolean
};

export default class File extends React.PureComponent<Props> {
  render () {
    const { className, isError = false, style } = this.props;

    return (
      <Bare
        className={className}
        style={style}
      >
        <InputFile
          {...this.props}
          isError={isError}
        />
      </Bare>
    );
  }
}
