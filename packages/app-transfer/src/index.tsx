// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps } from '@polkadot/ui-app/types';

import React from 'react';

type Props = AppProps;

export default class App extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    return 'Deprecated, now operates via modal';
  }
}
