// Copyright 2017-2021 @canvas-ui/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Redirect } from 'react-router';

function NotFound (): React.ReactElement {
  return (
    <Redirect to='/upload' />
  );
}

export default React.memo(NotFound);
