// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

type Props = {
  error?: React.ReactNode
};

export default class Error extends React.PureComponent<Props> {
  render () {
    const { error: { props } } = this.props;

    return (
      <div props={props}></div>
    );
  }
}
