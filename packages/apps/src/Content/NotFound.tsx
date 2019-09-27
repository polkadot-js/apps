// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Redirect } from 'react-router';
import routing from '@polkadot/apps-routing';

type Props = {};

const defaultTo = `/${routing.default}`;

export default function NotFound (): React.ReactElement<Props> {
  return (
    <Redirect to={defaultTo} />
  );
}
