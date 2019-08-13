// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Columar } from '@polkadot/react-components';

import Proposals from './Proposals';
import Referendums from './Referendums';
import Summary from './Summary';

type Props = AppProps & BareProps & I18nProps;

export default class Overview extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    return (
      <>
        <Summary />
        <Columar>
          <Referendums />
          <Proposals />
        </Columar>
      </>
    );
  }
}
