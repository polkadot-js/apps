// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Columar } from '@polkadot/react-components';

import Summary from './Summary';
import Proposals, { Approvals } from './Proposals';
import Propose from './Propose';

interface Props extends AppProps, BareProps, I18nProps {}

export default function Overview (): React.ReactElement<Props> {
  return (
    <>
      <Summary />
      <Propose />
      <Columar>
        <Proposals />
        <Approvals />
      </Columar>
    </>
  );
}
