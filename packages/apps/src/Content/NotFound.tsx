// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Redirect } from 'react-router';

import routing from '../routing';

type Props = {};

const defaultTo = `/${routing.default}`;

export default class NotFound extends React.PureComponent<Props> {
  render () {
    return (
      <Redirect to={defaultTo} />
    );
  }
}
