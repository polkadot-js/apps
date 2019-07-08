// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Columar } from '@polkadot/ui-app';

import Summary from './Summary';
import Proposals, { Approvals } from './Proposals';

type Props = AppProps & BareProps & I18nProps;

type State = {
  isProposeOpen: boolean
};

export default class Overview extends React.PureComponent<Props, State> {
  state: State = {
    isProposeOpen: false
  };

  render () {
    return (
      <>
        <Summary />
        <Columar>
          <Proposals />
          <Approvals />
        </Columar>
      </>
    );
  }
}
