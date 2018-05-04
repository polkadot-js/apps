// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';

import React from 'react';
import Div from '@polkadot/rx-react/Div';
import withApiCall from '@polkadot/rx-react/with/apiCall';

import BlockHeader from '../BlockHeader';
import { blockHeaders as subject } from '../subjects';
import transform from './transform';

const apiMethod = {
  method: 'newHead',
  section: 'chain'
};

const apiOptions = {
  subject,
  transform
};

export default withApiCall(apiMethod, apiOptions)(Div, {
  className: 'explorer--BlockHeaders',
  format: (value?: Array<Header> = []): React$Node =>
    value.map((value) => (
      <BlockHeader
        key={value.number.toString()}
        value={value}
      />
    ))
});
