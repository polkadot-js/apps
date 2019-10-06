// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Columar } from '@polkadot/react-components';

import Proposals from './Proposals';
import Referendums from './Referendums';
import Summary from './Summary';
import Propose from './Propose';

export default function Overview (): React.ReactElement {
  return (
    <>
      <Summary />
      <Propose />
      <Columar>
        <Referendums />
        <Proposals />
      </Columar>
    </>
  );
}
