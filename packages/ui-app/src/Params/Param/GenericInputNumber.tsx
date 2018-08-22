// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

type Props = {
  children: any
};

class GenericInputNumber extends React.PureComponent<Props> {
  render () {
    const { children } = this.props;

    return (
      <div>
        { children }
      </div>
    );
  }
}

export default GenericInputNumber;
