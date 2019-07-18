// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';

export default class Null extends React.PureComponent<Props> {
  public componentDidMount (): void {
    const { onChange } = this.props;

    onChange && onChange({
      isValid: true,
      value: null
    });
  }

  public render (): React.ReactNode {
    return null;
  }
}
